<?php
// index.php - main REST API entry

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

// CORS and JSON headers
header('Access-Control-Allow-Origin: *'); // adjust in production
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    send_json(['status' => 'error', 'message' => 'Database connection failed', 'code' => 500], 500);
}

// Parse request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$base = rtrim($scriptName, '/');
$path = preg_replace('#^' . preg_quote($base) . '#', '', $uri);
$path = '/' . trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Route handling
$segments = array_values(array_filter(explode('/', $path), fn($s) => $s !== ''));

function respond_error($message, $code = 400)
{
    send_json(['status' => 'error', 'message' => $message, 'code' => $code], $code);
}

// ---------- PRODUCTS ----------
if (count($segments) >= 1 && $segments[0] === 'api' && ($segments[1] ?? '') === 'products') {
    // /api/products or /api/products/{id}
    $id = isset($segments[2]) ? intval($segments[2]) : null;

    if ($method === 'GET' && $id === null) {
        // GET /api/products -> with optional query params: page, per_page, q, sort_by, sort_dir, category
        $page = max(1, intval($_GET['page'] ?? 1));
        $per_page = min(100, max(1, intval($_GET['per_page'] ?? 10)));
        $offset = ($page - 1) * $per_page;

        $where = [];
        $params = [];

        if (!empty($_GET['q'])) {
            $where[] = '(p.name LIKE :q OR p.description LIKE :q)';
            $params[':q'] = '%' . $_GET['q'] . '%';
        }

        if (!empty($_GET['category'])) {
            $where[] = 'p.category = :category';
            $params[':category'] = $_GET['category'];
        }

        $where_sql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        // sorting
        $allowed_sort = ['price', 'name', 'category', 'created_at'];
        $sort_by = in_array($_GET['sort_by'] ?? '', $allowed_sort) ? $_GET['sort_by'] : 'id';
        $sort_dir = (strtoupper($_GET['sort_dir'] ?? 'ASC') === 'DESC') ? 'DESC' : 'ASC';

        // total count
        $countStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM products p $where_sql");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT p.* FROM products p $where_sql ORDER BY $sort_by $sort_dir LIMIT :limit OFFSET :offset");
        foreach ($params as $k => $v) $stmt->bindValue($k, $v);
        $stmt->bindValue(':limit', $per_page, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $products = $stmt->fetchAll();

        send_json([
            'status' => 'success',
            'data' => $products,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'per_page' => $per_page
            ],
            'message' => 'Products retrieved successfully'
        ]);
    }

    if ($method === 'GET' && $id !== null) {
        // GET /api/products/{id}
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $product = $stmt->fetch();
        if (!$product) respond_error('Product not found', 404);
        send_json(['status' => 'success', 'data' => $product, 'message' => 'Product retrieved successfully']);
    }

    if ($method === 'POST') {
        // POST /api/products - create
        $input = get_input_json();
        if ($input === null) respond_error('Invalid JSON', 400);

        // validate required fields
        $name = sanitize_string($input['name'] ?? '');
        $price = sanitize_float($input['price'] ?? null);

        if ($name === '' || $price === null) respond_error('Missing name or price', 422);

        $description = isset($input['description']) ? trim($input['description']) : null;
        $category = isset($input['category']) ? sanitize_string($input['category']) : null;
        $stock = sanitize_int($input['stock_quantity'] ?? 0);

        $stmt = $pdo->prepare("INSERT INTO products (name, description, price, category, stock_quantity) VALUES (:name, :description, :price, :category, :stock)");
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':price' => $price,
            ':category' => $category,
            ':stock' => $stock
        ]);

        $newId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $newId]);
        $product = $stmt->fetch();

        send_json(['status' => 'success', 'data' => $product, 'message' => 'Product created successfully'], 201);
    }

    if ($method === 'PUT' && $id !== null) {
        // PUT /api/products/{id} - update
        $input = get_input_json();
        if ($input === null) respond_error('Invalid JSON', 400);

        // Ensure exists
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $existing = $stmt->fetch();
        if (!$existing) respond_error('Product not found', 404);

        // Build update fields
        $fields = [];
        $params = [':id' => $id];

        if (isset($input['name'])) {
            $fields[] = 'name = :name';
            $params[':name'] = sanitize_string($input['name']);
        }
        if (isset($input['description'])) {
            $fields[] = 'description = :description';
            $params[':description'] = $input['description'];
        }
        if (isset($input['price'])) {
            $fields[] = 'price = :price';
            $params[':price'] = sanitize_float($input['price']);
        }
        if (isset($input['category'])) {
            $fields[] = 'category = :category';
            $params[':category'] = sanitize_string($input['category']);
        }
        if (isset($input['stock_quantity'])) {
            $fields[] = 'stock_quantity = :stock';
            $params[':stock'] = sanitize_int($input['stock_quantity']);
        }

        if (empty($fields)) respond_error('No fields to update', 422);

        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $product = $stmt->fetch();

        send_json(['status' => 'success', 'data' => $product, 'message' => 'Product updated successfully']);
    }

    if ($method === 'DELETE' && $id !== null) {
        // DELETE /api/products/{id}
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        if (!$stmt->fetch()) respond_error('Product not found', 404);

        $del = $pdo->prepare("DELETE FROM products WHERE id = :id");
        $del->execute([':id' => $id]);
        send_json(['status' => 'success', 'message' => 'Product deleted successfully']);
    }

    respond_error('Method not allowed', 405);
}

// ---------- CATEGORIES ----------
if (count($segments) >= 1 && $segments[0] === 'api' && ($segments[1] ?? '') === 'categories') {
    // /api/categories or /api/categories/{id}/products
    if ($method === 'GET' && count($segments) === 2) {
        $stmt = $pdo->query("SELECT * FROM categories ORDER BY name");
        $cats = $stmt->fetchAll();
        send_json(['status' => 'success', 'data' => $cats, 'message' => 'Categories retrieved']);
    }

    if ($method === 'GET' && isset($segments[2]) && isset($segments[3]) && $segments[3] === 'products') {
        $categoryId = intval($segments[2]);
        // find category name
        $stmt = $pdo->prepare("SELECT name FROM categories WHERE id = :id");
        $stmt->execute([':id' => $categoryId]);
        $cat = $stmt->fetch();
        if (!$cat) respond_error('Category not found', 404);

        $stmt = $pdo->prepare("SELECT * FROM products WHERE category = :category");
        $stmt->execute([':category' => $cat['name']]);
        $prods = $stmt->fetchAll();
        send_json(['status' => 'success', 'data' => $prods, 'message' => 'Products by category retrieved']);
    }

    respond_error('Method not allowed or route invalid', 405);
}

// fallback
respond_error('Route not found', 404);

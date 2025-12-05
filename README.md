# PHP REST API CRUD Application

A simple Product Management System with REST API backend and frontend interface.

## Quick Start for XAMPP

### 1. Move Project to XAMPP htdocs

**On macOS:**
```bash
cp -r "php-rest-api-crud" /Applications/XAMPP/htdocs/
```

**Or manually:**
- Copy the entire `php-rest-api-crud` folder to `/Applications/XAMPP/htdocs/`

### 2. Start XAMPP Services

1. Open XAMPP Control Panel
2. Start **Apache** 
3. Start **MySQL**

### 3. Setup Database

**Option A: Import SQL file (Recommended)**
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "Import" tab
3. Select file: `/Applications/XAMPP/htdocs/php-rest-api-crud/database/product_management.sql`
4. Click "Go"

**Option B: Create manually**
1. Create database named `product_management` in phpMyAdmin
2. Copy and run the SQL from `database/product_management.sql`

### 4. Configure Database (if needed)

Edit `backend/config.php` if your MySQL has a password:
```php
$db_pass = 'your_password';
```

By default, XAMPP uses:
- Host: `127.0.0.1`
- User: `root`  
- Password: `` (empty)

### 5. Access the Application

**Frontend:**
```
http://localhost/php-rest-api-crud/frontend/
```

**API Endpoint (test):**
```
http://localhost/php-rest-api-crud/backend/api/products
```

## Project Structure

```
php-rest-api-crud/
├── backend/
│   ├── .htaccess          # URL rewriting rules
│   ├── config.php         # Database configuration
│   ├── helpers.php        # Helper functions
│   └── index.php          # Main API router
├── database/
│   └── product_management.sql  # Database schema
├── frontend/
│   ├── app.js            # Frontend JavaScript
│   ├── index.html        # Main HTML page
│   └── style.css         # Styles
├── .htaccess            # Root URL rewriting
└── README.md

```

## API Endpoints

### Products

- `GET /backend/api/products` - Get all products (with pagination, search, filter)
- `GET /backend/api/products/{id}` - Get single product
- `POST /backend/api/products` - Create new product
- `PUT /backend/api/products/{id}` - Update product
- `DELETE /backend/api/products/{id}` - Delete product

### Query Parameters (GET /products)

- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 10)
- `q` - Search query (searches name and description)
- `category` - Filter by category
- `sort_by` - Sort field (price, name, category, created_at)
- `sort_dir` - Sort direction (ASC, DESC)

### Categories

- `GET /backend/api/categories` - Get all categories
- `GET /backend/api/categories/{id}/products` - Get products by category

## Troubleshooting

### "Database connection failed"
- ✅ Check if MySQL is running in XAMPP
- ✅ Verify database `product_management` exists
- ✅ Check credentials in `backend/config.php`

### "404 Not Found" or routes not working
- ✅ Enable mod_rewrite in Apache (usually enabled by default)
- ✅ Verify `.htaccess` files exist
- ✅ Check Apache error logs: `/Applications/XAMPP/logs/error_log`

### Products not loading in frontend
- ✅ Open browser DevTools (F12) → Console tab
- ✅ Check Network tab for failed API requests
- ✅ Verify API URL in browser console

### CORS Errors
- ✅ Should be handled automatically by backend headers
- ✅ Check browser console for specific errors

## Testing the API

### Using Browser
Open in browser to test GET requests:
- http://localhost/php-rest-api-crud/backend/api/products
- http://localhost/php-rest-api-crud/backend/api/categories

### Using cURL

**Get all products:**
```bash
curl http://localhost/php-rest-api-crud/backend/api/products
```

**Create product:**
```bash
curl -X POST http://localhost/php-rest-api-crud/backend/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"category":"Electronics","stock_quantity":10}'
```

**Update product:**
```bash
curl -X PUT http://localhost/php-rest-api-crud/backend/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Product","price":149.99}'
```

**Delete product:**
```bash
curl -X DELETE http://localhost/php-rest-api-crud/backend/api/products/1
```

## Requirements

- XAMPP (Apache + MySQL)
- PHP 7.4+ (included in XAMPP)
- Modern web browser

## Notes

- CORS is enabled for all origins (change in production)
- Database uses UTF8MB4 encoding
- API returns JSON responses
- Frontend uses jQuery for AJAX requests

---

For detailed setup instructions, see **XAMPP_SETUP.md**



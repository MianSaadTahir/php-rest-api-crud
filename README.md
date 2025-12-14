# Product Management System

A full-stack web application for managing products and categories. The backend is built with PHP and MySQL providing RESTful APIs, while the frontend is a dynamic interface built with JavaScript, jQuery, and CSS that consumes these APIs.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
## Features

- Full CRUD operations for products (Create, Read, Update, Delete)
- Category management and viewing products by category
- RESTful API with standardized JSON responses
- Frontend dynamically consumes APIs using jQuery AJAX
- Pagination, search, and filter capabilities
- Real-time product list updates
- Clean and responsive UI with Bootstrap
- Input validation and error handling for all operations

## Screenshots

<img src="/assets/1.png" alt="frontend" width="75%">
<img src="/assets/2.png" alt="postman" width="75%">

## Technologies Used

- PHP
- MySQL
- JavaScript
- jQuery
- HTML/CSS
- Bootstrap

## Usage

1. Download and Install XAMPP.
2. Clone the repository:

   ```bash
   git clone https://github.com/MianSaadTahir/php-rest-api-crud.git
   ```

3. Copy the project folder to `C:\xampp\htdocs\` (Windows) or `/Applications/XAMPP/htdocs/` (Mac)
4. Open XAMPP Control Panel and start Apache & MySQL server.

5. - Go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
   - Go to the "Import" tab
   - Click "Choose File" and select `database/product_management.sql` from your project folder to import the database schema
6. Go to [http://localhost/php-rest-api-crud/frontend/](http://localhost/php-rest-api-crud/frontend/]) to view the project

## API Documentation

### Products API

**GET /api/products**

- Description: Retrieve all products.
- Request: None
- Response:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": "999.99",
      "category": "Electronics",
      "stock_quantity": 15,
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "name": "Smartphone",
      "description": "Latest smartphone model",
      "price": "699.99",
      "category": "Electronics",
      "stock_quantity": 25,
      "created_at": "2024-01-15 10:31:00",
      "updated_at": "2024-01-15 10:31:00"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "per_page": 10
  },
  "message": "Products retrieved successfully"
}
```

**GET /api/products/{id}**

- Description: Retrieve a single product by ID.
- Request: None
- Response:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": "999.99",
    "category": "Electronics",
    "stock_quantity": 15,
    "created_at": "2024-01-15 10:30:00",
    "updated_at": "2024-01-15 10:30:00"
  },
  "message": "Product retrieved successfully"
}
```

**POST /api/products**

- Description: Create a new product.
- Request Body:

```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "category": "Books",
  "stock_quantity": 10
}
```

- Response:

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "New Product",
    "description": "Product description",
    "price": "49.99",
    "category": "Books",
    "stock_quantity": 10,
    "created_at": "2024-01-15 11:00:00",
    "updated_at": "2024-01-15 11:00:00"
  },
  "message": "Product created successfully"
}
```

**PUT /api/products/{id}**

- Description: Update an existing product by ID.
- Request Body: (any fields to update)

```json
{
  "name": "Updated Product",
  "price": 59.99,
  "stock_quantity": 20
}
```

- Response:

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "Updated Product",
    "description": "Product description",
    "price": "59.99",
    "category": "Books",
    "stock_quantity": 20,
    "created_at": "2024-01-15 11:00:00",
    "updated_at": "2024-01-15 11:15:00"
  },
  "message": "Product updated successfully"
}
```

**DELETE /api/products/{id}**

- Description: Delete a product by ID.
- Request: None
- Response:

```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

### Categories API

**GET /api/categories**

- Description: Retrieve all categories.
- Request: None
- Response:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and accessories"
    },
    {
      "id": 2,
      "name": "Books",
      "description": "Various books and publications"
    },
    {
      "id": 3,
      "name": "Clothing",
      "description": "Apparel and fashion items"
    }
  ],
  "message": "Categories retrieved"
}
```

**GET /api/categories/{id}/products**

- Description: Retrieve all products under a specific category by category ID.
- Request: None
- Response:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": "999.99",
      "category": "Electronics",
      "stock_quantity": 15,
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "name": "Smartphone",
      "description": "Latest smartphone model",
      "price": "699.99",
      "category": "Electronics",
      "stock_quantity": 25,
      "created_at": "2024-01-15 10:31:00",
      "updated_at": "2024-01-15 10:31:00"
    }
  ],
  "message": "Products by category retrieved"
}
```

## Contributing

Contributions, issues, and feature requests are welcome.
Feel free to check out the [issues page](https://github.com/MianSaadTahir/php-rest-api-crud/issues) for more information.


## License

This project is open source and available under the MIT [License](https://github.com/MianSaadTahir/php-rest-api-crud/blob/main/LICENSE).

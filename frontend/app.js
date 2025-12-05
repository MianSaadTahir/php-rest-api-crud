// Load products on page load
$(document).ready(function () {
  loadProducts();
});

// Backend API base URL - automatically detects the project folder
// If your project folder is 'php-rest-api-crud' in htdocs, this will work automatically
// If you use a different folder name, change the folder name below
function getApiBaseUrl() {
  // Get current path and extract project folder
  const path = window.location.pathname;
  // Extract folder name (e.g., '/php-rest-api-crud/frontend/' -> '/php-rest-api-crud')
  const match = path.match(/^\/([^\/]+)/);
  if (match) {
    return '/' + match[1] + '/backend/api';
  }
  // Fallback
  return '/backend/api';
}
const API_BASE_URL = getApiBaseUrl();

// Fetch and display products
function loadProducts() {
  $.ajax({
    url: API_BASE_URL + "/products",
    method: "GET",
    dataType: "json",
    success: function (response) {
      displayProducts(response.data);
    },
    error: function (xhr, status, error) {
      console.error("Error loading products:", error, xhr.responseText);
      alert("Failed to load products. Check console for details.");
    },
  });
}

// Render products in table
function displayProducts(products) {
  let rows = "";

  products.forEach((product) => {
    rows += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td>${product.stock_quantity}</td>
                <td>
                    <button onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `;
  });

  $("#product-table tbody").html(rows);
}

// Create new product
$("#createBtn").click(function () {
  let productData = {
    name: $("#name").val(),
    description: $("#description").val(),
    price: $("#price").val(),
    category: $("#category").val(),
    stock_quantity: $("#stock").val(),
  };

  $.ajax({
    url: API_BASE_URL + "/products",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(productData),
    success: function () {
      alert("Product created!");
      // Clear form
      $("#name, #description, #price, #category, #stock").val("");
      loadProducts();
    },
    error: function (xhr, status, error) {
      console.error("Error creating product:", error, xhr.responseText);
      alert("Error creating product. Check console for details.");
    },
  });
});

// Delete product
function deleteProduct(id) {
  if (!confirm("Are you sure?")) return;

  $.ajax({
    url: API_BASE_URL + `/products/${id}`,
    method: "DELETE",
    success: function () {
      alert("Product deleted");
      loadProducts();
    },
    error: function (xhr, status, error) {
      console.error("Error deleting product:", error, xhr.responseText);
      alert("Delete failed. Check console for details.");
    },
  });
}

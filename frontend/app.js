// Load products on page load
$(document).ready(function () {
  loadProducts();
});

// Backend API base URL - automatically detects the project folder
function getApiBaseUrl() {
  const path = window.location.pathname;
  const match = path.match(/^\/([^\/]+)/);
  if (match) {
    return "/" + match[1] + "/backend/api";
  }
  return "/backend/api";
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
        <td>${product.category || "N/A"}</td>
        <td>${product.stock_quantity}</td>
        <td>
          <button onclick="editProduct(${product.id})">Edit</button>
          <button onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      </tr>
    `;
  });

  $("#product-table tbody").html(rows);
}

// Create new product
function createProductHandler() {
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
      resetForm();
      loadProducts();
    },
    error: function (xhr, status, error) {
      console.error("Error creating product:", error, xhr.responseText);
      alert("Error creating product. Check console for details.");
    },
  });
}

// Edit product - load data into form
function editProduct(id) {
  $.ajax({
    url: API_BASE_URL + `/products/${id}`,
    method: "GET",
    success: function (response) {
      const p = response.data;

      // Fill form with product data
      $("#name").val(p.name);
      $("#description").val(p.description);
      $("#price").val(p.price);
      $("#category").val(p.category);
      $("#stock").val(p.stock_quantity);

      // Change button to update mode
      $("#createBtn")
        .text("Update Product")
        .off("click")
        .click(function () {
          updateProduct(id);
        });

      // Add cancel button if not exists
      if ($("#cancelBtn").length === 0) {
        $("#createBtn").after(
          '<button id="cancelBtn" style="margin-left: 10px;">Cancel</button>'
        );
        $("#cancelBtn").click(function () {
          resetForm();
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading product:", error, xhr.responseText);
      alert("Error loading product for editing.");
    },
  });
}

// Update product
function updateProduct(id) {
  let productData = {
    name: $("#name").val(),
    description: $("#description").val(),
    price: $("#price").val(),
    category: $("#category").val(),
    stock_quantity: $("#stock").val(),
  };

  $.ajax({
    url: API_BASE_URL + `/products/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(productData),
    success: function () {
      alert("Product updated!");
      resetForm();
      loadProducts();
    },
    error: function (xhr, status, error) {
      console.error("Error updating product:", error, xhr.responseText);
      alert("Update failed. Check console for details.");
    },
  });
}

// Delete product
function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  $.ajax({
    url: API_BASE_URL + `/products/${id}`,
    method: "DELETE",
    success: function () {
      alert("Product deleted successfully!");
      loadProducts();
    },
    error: function (xhr, status, error) {
      console.error("Error deleting product:", error, xhr.responseText);
      alert("Delete failed. Check console for details.");
    },
  });
}

// Reset form to create mode
function resetForm() {
  // Clear all form fields
  $("#name, #description, #price, #category, #stock").val("");

  // Reset button to create mode
  $("#createBtn").text("Add Product").off("click").click(createProductHandler);

  // Remove cancel button if exists
  $("#cancelBtn").remove();
}

// Initialize create button handler
$("#createBtn").click(createProductHandler);

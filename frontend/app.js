// Load products on page load
$(document).ready(function () {
  loadProducts();
});

// Fetch and display products
function loadProducts() {
  $.ajax({
    url: "/api/products",
    method: "GET",
    dataType: "json",
    success: function (response) {
      displayProducts(response.data);
    },
    error: function () {
      alert("Failed to load products");
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
    url: "/api/products",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(productData),
    success: function () {
      alert("Product created!");
      loadProducts();
    },
    error: function () {
      alert("Error creating product");
    },
  });
});

// Delete product
function deleteProduct(id) {
  if (!confirm("Are you sure?")) return;

  $.ajax({
    url: `/api/products/${id}`,
    method: "DELETE",
    success: function () {
      alert("Product deleted");
      loadProducts();
    },
    error: function () {
      alert("Delete failed");
    },
  });
}

// Load products on page load
$(document).ready(function () {
  loadProducts();
});

// Backend API base URL - automatically detects the project folder
function getApiBaseUrl() {
  const path = window.location.pathname;
  // Extract project folder name (works for both /project/ and /project/frontend/)
  const match = path.match(/^\/([^\/]+)/);
  if (match) {
    const folderName = match[1];
    return "/" + folderName + "/backend/api";
  }
  return "/backend/api";
}
const API_BASE_URL = getApiBaseUrl();

// Debug: Log the API URL
console.log("API Base URL:", API_BASE_URL);

// Fetch and display products
function loadProducts() {
  const apiUrl = API_BASE_URL + "/products";
  console.log("Fetching products from:", apiUrl);

  $.ajax({
    url: apiUrl,
    method: "GET",
    dataType: "json",
    success: function (response) {
      console.log("API Response:", response);
      if (response && response.data && Array.isArray(response.data)) {
        console.log("Products found:", response.data.length);
        displayProducts(response.data);
      } else {
        console.warn("Invalid response structure:", response);
        displayProducts([]);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading products:", error);
      console.error("Status:", xhr.status);
      console.error("Response:", xhr.responseText);
      $("#product-table tbody").html(`
        <tr>
          <td colspan="6" class="text-center text-danger py-5">
            <i class="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
            Failed to load products. Check console for details.<br/>
            <small>Status: ${xhr.status} | URL: ${apiUrl}</small>
          </td>
        </tr>
      `);
      $("#product-count").text("Error loading products");
    },
  });
}

// Render products in table
function displayProducts(products) {
  if (!products || products.length === 0) {
    $("#product-table tbody").html(`
      <tr>
        <td colspan="6" class="text-center text-muted py-5">
          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
          No products found. Add your first product above!
        </td>
      </tr>
    `);
    $("#product-count").text("0 Products");
    return;
  }

  let rows = "";
  products.forEach((product) => {
    const stockBadge =
      product.stock_quantity > 0
        ? `<span class="badge bg-success">${product.stock_quantity}</span>`
        : `<span class="badge bg-danger">Out of Stock</span>`;

    rows += `
      <tr>
        <td class="fw-bold">#${product.id}</td>
        <td><strong>${product.name}</strong></td>
        <td><span class="fw-bold text-success">$${parseFloat(
          product.price
        ).toFixed(2)}</span></td>
        <td><span class="badge bg-info text-dark">${
          product.category || "Uncategorized"
        }</span></td>
        <td>${stockBadge}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="editProduct(${
              product.id
            })" title="Edit">
              <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${
              product.id
            })" title="Delete">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  $("#product-table tbody").html(rows);
  $("#product-count").text(
    `${products.length} ${products.length === 1 ? "Product" : "Products"}`
  );
}

// Create new product
function createProductHandler() {
  let productData = {
    name: $("#name").val(),
    description: $("#description").val(),
    price: $("#price").val(),
    category: $("#category").val(),
    stock_quantity: $("#stock").val() || 0,
  };

  if (!productData.name || !productData.price) {
    showAlert("Please fill in all required fields (Name and Price)", "warning");
    return;
  }

  $.ajax({
    url: API_BASE_URL + "/products",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(productData),
    success: function () {
      showAlert("Product created successfully!", "success");
      resetForm();
      loadProducts();
    },
    error: function (xhr, status, error) {
      console.error("Error creating product:", error, xhr.responseText);
      showAlert("Error creating product. Please try again.", "danger");
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
      $("#product-id").val(p.id);
      $("#name").val(p.name || "");
      $("#description").val(p.description || "");
      $("#price").val(p.price || "");
      $("#category").val(p.category || "");
      $("#stock").val(p.stock_quantity || 0);

      // Switch to edit mode
      $("#form-title").html('<i class="bi bi-pencil-square"></i> Edit Product');
      $("#createBtn").addClass("d-none");
      $("#updateBtn").removeClass("d-none").attr("data-product-id", id);
      $("#cancelBtn").removeClass("d-none");

      // Scroll to form
      $("html, body").animate(
        { scrollTop: $("#product-form").offset().top - 100 },
        500
      );
    },
    error: function (xhr, status, error) {
      console.error("Error loading product:", error, xhr.responseText);
      showAlert("Error loading product for editing.", "danger");
    },
  });
}

// Update product
$("#updateBtn").click(function () {
  const id = $(this).attr("data-product-id");
  if (!id) return;

  let productData = {
    name: $("#name").val(),
    description: $("#description").val(),
    price: $("#price").val(),
    category: $("#category").val(),
    stock_quantity: $("#stock").val() || 0,
  };

  if (!productData.name || !productData.price) {
    showAlert("Please fill in all required fields (Name and Price)", "warning");
    return;
  }

  $.ajax({
    url: API_BASE_URL + `/products/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(productData),
    success: function () {
      showAlert("Product updated successfully!", "success");
      resetForm();
      loadProducts();
    },
    error: function (xhr, status, error) {
      console.error("Error updating product:", error, xhr.responseText);
      showAlert("Error updating product. Please try again.", "danger");
    },
  });
});

// Delete product
function deleteProduct(id) {
  if (
    !confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    )
  )
    return;

  $.ajax({
    url: API_BASE_URL + `/products/${id}`,
    method: "DELETE",
    success: function () {
      showAlert("Product deleted successfully!", "success");
      loadProducts();
    },
    error: function (xhr, status, error) {
      console.error("Error deleting product:", error, xhr.responseText);
      showAlert("Error deleting product. Please try again.", "danger");
    },
  });
}

// Reset form to create mode
function resetForm() {
  // Clear all form fields
  $("#product-id").val("");
  $("#name, #description, #price, #category, #stock").val("");

  // Reset to add mode
  $("#form-title").html('<i class="bi bi-plus-circle"></i> Add New Product');
  $("#createBtn").removeClass("d-none");
  $("#updateBtn").addClass("d-none").removeAttr("data-product-id");
  $("#cancelBtn").addClass("d-none");
}

// Show alert message
function showAlert(message, type = "info") {
  const alertHtml = `
    <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" style="z-index: 9999; min-width: 300px;" role="alert">
      <i class="bi bi-${
        type === "success"
          ? "check-circle"
          : type === "danger"
          ? "exclamation-triangle"
          : "info-circle"
      }"></i> ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  $("body").append(alertHtml);

  // Auto remove after 3 seconds
  setTimeout(() => {
    $(".alert").fadeOut(() => $(this).remove());
  }, 3000);
}

// Cancel button handler
$("#cancelBtn").click(function () {
  resetForm();
});

// Initialize create button handler
$("#createBtn").click(createProductHandler);

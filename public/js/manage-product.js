async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  products.forEach((p) => {
    table.innerHTML += `
        <tr>
            <td><img src="/uploads/products/${p.image}" /></td>
            <td contenteditable="true" id="name-${p._id}">${p.name}</td>
            <td contenteditable="true" id="brand-${p._id}">${p.brand}</td>
            <td contenteditable="true" id="price-${p._id}">${p.price}</td>

            <td>
                <button class="edit" onclick="updateProduct('${p.id}')">
                    Save
                </button>
            </td>

            <td>
                <button class="delete" onclick="deleteProduct('${p.id}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
  });
}

/* UPDATE PRODUCT (INLINE EDIT) */
async function updateProduct(id) {
  const name = document.getElementById(`name-${id}`).innerText.trim();
  const brand = document.getElementById(`brand-${id}`).innerText.trim();
  const price = parseInt(
    document.getElementById(`price-${id}`).innerText.trim(),
  );

  const res = await fetch(`/api/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, brand, price }),
  });

  const data = await res.json();
  console.log(data);

  alert("Updated ✅");
}

/* DELETE PRODUCT */
async function deleteProduct(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this product?",
  );

  if (!confirmDelete) return;

  await fetch(`/api/product/${id}`, {
    method: "DELETE",
  });

  alert("Deleted successfully 🗑");
  loadProducts();
}

loadProducts();

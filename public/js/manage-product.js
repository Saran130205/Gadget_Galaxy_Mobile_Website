function getId(p) {
    return p.id || p._id;
}

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  products.forEach((p) => {

    const id = getId(p);

    table.innerHTML += `
        <tr>
            <td><img src="/uploads/products/${p.image}" /></td>

            <td contenteditable="true" id="name-${id}">
                ${p.name}
            </td>

            <td contenteditable="true" id="brand-${id}">
                ${p.brand}
            </td>

            <td contenteditable="true" id="price-${id}">
                ${p.price}
            </td>

            <td>
                <button class="edit" onclick="updateProduct('${id}')">
                    Save
                </button>
            </td>

            <td>
                <button class="delete" onclick="deleteProduct('${id}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
  });
}

/* UPDATE PRODUCT (INLINE EDIT) */
async function updateProduct(id) {

    const nameEl = document.getElementById(`name-${id}`);
    const brandEl = document.getElementById(`brand-${id}`);
    const priceEl = document.getElementById(`price-${id}`);

    if (!nameEl || !brandEl || !priceEl) {
        alert("Element not found ❌");
        return;
    }

    const name = nameEl.innerText.trim();
    const brand = brandEl.innerText.trim();
    const price = parseInt(priceEl.innerText.trim());

    const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, brand, price })
    });

    const data = await res.json();
    console.log(data);

    alert("Updated successfully ");
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
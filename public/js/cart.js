fetch("/api/cart")
  .then((res) => res.json())

  .then((data) => {
    const container = document.getElementById("cartItems");

    let total = 0;

    container.innerHTML = "";

    data.forEach((item) => {
      total += item.price * item.quantity;

      container.innerHTML += `
<tr>

<td>${item.name}</td>

<td>₹${item.price}</td>

<td>${item.quantity}</td>

<td>
<button onclick="removeCart(${item.product_id})">Remove</button>
</td>

</tr>
`;
    });

    document.getElementById("totalPrice").innerText = total;
  });

fetch("/api/cart")
  .then((res) => res.json())

  .then((data) => {
    const container = document.getElementById("cartItems");

    let grandTotal = 0;

    container.innerHTML = "";

    data.forEach((item) => {
      let total = item.price * item.quantity;

      grandTotal += total;

      container.innerHTML += `
<tr>

<td>
<img src="/uploads/products/${item.image}" width="80">
<br>
${item.name}
</td>

<td>₹${item.price}</td>

<td>${item.quantity}</td>

<td>₹${total}</td>

<td>
<button onclick="removeItem(${item.id})">Remove</button>
</td>

</tr>
`;
    });

    document.getElementById("grandTotal").innerText = grandTotal;
  });

function removeCart(id) {
  fetch("/api/cart/remove/" + id, {
    method: "DELETE",
  }).then(() => {
    location.reload();
  });
}

function removeCart(id) {
  fetch("/api/cart/remove/" + id, {
    method: "DELETE",
  }).then(() => {
    location.reload();
  });
}

function removeItem(id) {
  fetch("/api/cart/remove/" + id, {
    method: "DELETE",
  }).then(() => {
    location.reload();
  });
}

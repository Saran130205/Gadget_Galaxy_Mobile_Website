const cartTable = document.getElementById("cartTable");

fetch("/api/profile")
.then(res => {
    if (!res.ok) {
        alert("Login required");
        window.location.href = "/login";
    }
});

fetch("/api/cart")
  .then((res) => res.json())
  .then((data) => {
    let total = 0;
    cartTable.innerHTML = "";
    data.forEach((item) => {
      let row = `
<tr>
<td>
<img src="/uploads/products/${item.image}" width="80">
${item.name}
</td>
<td>₹${item.price}</td>
<td>
  <button onclick="decreaseQty(${item.id})">➖</button>
  ${item.quantity}
  <button onclick="increaseQty(${item.id})">➕</button>
</td>
<td>₹${item.price * item.quantity}</td>
<td>
<button onclick="removeItem(${item.product_id})">Remove</button>
</td>
</tr>
`;
      cartTable.innerHTML += row;
      total += item.price * item.quantity;
    });
    document.getElementById("totalPrice").innerText = total;
  });

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("addToCartBtn")) {
    const productId = e.target.dataset.id;

    fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Product added to cart");
      });
  }
});

function removeItem(id) {
  fetch("/api/cart/remove/" + id, {
    method: "DELETE",
    credentials: "include",
  }).then(() => {
    location.reload();
  });
}

// function increaseQty(id){
//   fetch("/api/cart/increase/" + id, {
//     method: "PUT",
//     credentials: "include" // 🔥 IMPORTANT
//   })
//   .then(res => res.json())
//   .then(() => location.reload());
// }

function increaseQty(id){
  fetch("/api/cart/increase/" + id, {
    method: "PUT",
    credentials: "include" // 🔥 IMPORTANT
  })
  .then(res => res.json())
  .then(() => location.reload());
}

function decreaseQty(id){
  fetch("/api/cart/decrease/" + id, {
    method: "PUT",
    credentials: "include"
  })
  .then(res => res.json())
  .then(() => location.reload());
}

function searchProducts() {
  const query = document.getElementById("searchInput").value;
  window.location.href = "/brand?name=" + query;
}

function checkout() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Login first!");
    localStorage.setItem("redirectAfterLogin", "/checkout.html");
    window.location.href = "/login.html";
  } else {
    window.location.href = "/checkout.html";
  }
}

function gotoCart() {
  window.location.href = "/user/cart.html";
}

function wishList() {
  window.location.href = "/user/wishlist.html";
}

function renderCartMobile(data){
    const container = document.getElementById("cartTable");

    if(window.innerWidth <= 768){

        container.innerHTML = data.map(item => `
            <div class="cart-card">
                <img src="/uploads/products/${item.image}" />
                <h4>${item.name}</h4>
                <p>Price: ₹${item.price}</p>
                <p>Total: ₹${item.price * item.quantity}</p>

                <div class="qty-controls">
                    <button onclick="decreaseQty(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQty(${item.id})">+</button>
                </div>

                <button class="remove-btn"
                    onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `).join("");

    }
}

function loadUser() {

    fetch("/api/profile")
    .then(res => res.json())
    .then(user => {

        const section = document.getElementById("userSection");

        if (user && user.name) {
            section.innerHTML = `
                <span onclick="goToProfile()" style="cursor:pointer;">
                    👋 ${user.name}
                </span>
            `;
        } else {
            section.innerHTML = `
                <i class="fa-solid fa-user" onclick="goToLogin()"></i>
            `;
        }
    });
}
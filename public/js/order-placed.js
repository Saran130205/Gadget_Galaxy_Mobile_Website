fetch("/api/order/latest")
  .then((res) => res.json())
  .then((items) => {
    const container = document.getElementById("orderContainer");
    items.forEach((item) => {
      container.innerHTML += `
    <div style="border:1px solid #ddd; margin:10px; padding:10px; text-align:center;">
      <img src="/uploads/products/${item.image}" width="120">
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
    </div>
    `;
    });
  });

  function searchProducts() {
  const query = document.getElementById("searchInput").value;
  window.location.href = "/brand?name=" + query;
}

function gotoCart() {
    window.location.href = "/user/cart.html";
}

function wishList() {
    window.location.href = "/user/wishlist.html";
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


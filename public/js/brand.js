const params = new URLSearchParams(window.location.search);
const brand = params.get("name");

document.getElementById("title").innerText = brand + " Mobiles";
fetch("/api/products/brand/" + brand)
  .then((res) => res.json())
  .then((products) => {
    const container = document.getElementById("productContainer");
    container.innerHTML = "";
    products.forEach((product) => {
      container.innerHTML += `
<div class="mobile-card" onclick="visitProduct('${product._id || product.id}')"">
<img src="/uploads/products/${product.image}" width="150">
<h4>${product.name}</h4>
<p>₹${product.price}</p>
</div>
`;
    });
  });

function visitProduct(id) {
  window.location.href = `/product.html?id=${id}`;
}

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

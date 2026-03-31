
async function loadWishlist() {
  const res = await fetch("/api/wishlist", {
    credentials: "include"
  });

  const data = await res.json();

  const container = document.getElementById("wishlist-container");

  if (!data.length) {
    container.innerHTML = "<p>No items in wishlist</p>";
    return;
  }

  container.innerHTML = data.map(product => `
    <div class="mobile-card" onclick="window.location.href='/product?id=${product.id}'">
      <img src="/uploads/products/${product.image}" />
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
    </div>
  `).join("");
}

async function gotoCart() {
    const res = await fetch("/api/me", {
        credentials: "include"
    });

    const data = await res.json();

    if (!data.user) {
        alert("Please login first!");
        window.location.href = "/login";
        return;
    }

    window.location.href = "/user/cart.html";
}


async function wishList() {
    const res = await fetch("/api/me", {
        credentials: "include"
    });

    const data = await res.json();

    if (!data.user) {
        alert("Please login first!");
        window.location.href = "/login";
        return;
    }

    window.location.href = "/user/wishlist.html";
}

loadWishlist();
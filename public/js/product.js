// GET PRODUCT DETAILS
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("Product not found!");
  window.location.href = "/";
}

fetch("/api/product/" + id)
  .then((res) => res.json())
  .then((product) => {
    document.getElementById("name").innerText = product.name;
    document.getElementById("brand").innerText = product.brand;
    document.getElementById("price").innerText = product.price;
    document.getElementById("description").innerText = product.description;
    document.getElementById("image").src = "/uploads/products/" + product.image;

    document.getElementById("battery").innerText = product.battery;
    document.getElementById("ram").innerText = product.ram;
    document.getElementById("storage").innerText = product.storage;
    document.getElementById("display").innerText = product.display;
    document.getElementById("processor").innerText = product.processor;
    document.getElementById("camera").innerText = product.camera;
    document.getElementById("os").innerText = product.os;
    document.getElementById("network").innerText = product.network;
    const ramValue = product.ram.toString().replace("GB", "").trim();

    // loadRelatedMobiles(ramValue, product.id);
  });

  async function checkLogin() {
  const res = await fetch("/api/me", {
    credentials: "include"
  });

  const data = await res.json();

  if (!data.user) {
    alert("Please login first!");
    window.location.href = "/login";
    return false;
  }

  return true;
}

//  BUY NOW (LOGIN CHECK)
async function handleBuy() {
  const res = await fetch("/api/me", {
    credentials: "include"
  });
  const data = await res.json();

  if (!data.user) {
    alert("Please login first!");
    window.location.href = "/login";
  } else {
    //  ADD THIS LINE (USE EXISTING FUNCTION)
    await addToCart();
    //  THEN REDIRECT
    window.location.href = "/checkout";
  }
}

//  ADD TO CART (BACKEND)
async function addToCart() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  console.log("Product ID:", productId); // DEBUG

  if (!productId) {
    alert("Product ID missing!");
    return;
  }

  const res = await fetch("/api/cart/add", {
    method: "POST",
    credentials: "include", // 🔥 ADDED (IMPORTANT)
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: 1
    }),
  });

  const data = await res.json();

  console.log(data);

  if (res.ok) {
    alert("Added to cart!");
  } else {
    alert(data.message || "Error adding to cart");
  }
}

function searchProducts() {
  const query = document.getElementById("searchInput").value;
  window.location.href = "/brand?name=" + query;
}

async function gotoCart() {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) return;

  window.location.href = "/user/cart.html";
}

function displayRelatedMobiles(mobiles) {
  const container = document.getElementById("related-mobiles");

  if (!container) return;

  container.innerHTML = "";

  mobiles.forEach(mobile => {
    const card = `
      <div class="mobile-card" onclick="window.location.href='/product?id=${mobile.id}'">
        <img src="/uploads/products/${mobile.image}" />
        <h4>${mobile.name}</h4>
        <p>${mobile.ram} GB RAM</p>
        <p>₹${mobile.price}</p>
      </div>
    `;

    container.innerHTML += card;
  });
}

function loadRelatedMobiles() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  fetch(`http://localhost:5000/api/related/${productId}`)
    .then(res => res.json())
    .then(data => {
      console.log("Related Mobiles:", data);
      displayRelatedMobiles(data); // ✅ YOUR FUNCTION
    })
    .catch(err => console.log(err));
}

function displayRelatedBrand(mobiles) {
  const container = document.getElementById("related-brand");

  if (!container) return;

  container.innerHTML = "";

  mobiles.forEach(mobile => {
    const card = `
      <div class="mobile-card" onclick="window.location.href='/product?id=${mobile.id}'">
        <img src="/uploads/products/${mobile.image}" />
        <h4>${mobile.name}</h4>
        <p>₹${mobile.price}</p>
      </div>
    `;

    container.innerHTML += card;
  });
}

function loadRelatedBrand() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  fetch(`http://localhost:5000/api/related-brand/${productId}`)
    .then(res => res.json())
    .then(data => {
      console.log("Brand Related:", data);
      displayRelatedBrand(data);
    })
    .catch(err => console.log(err));
}

function displayAllProducts(mobiles) {
  const container = document.getElementById("all-products");

  if (!container) return;

  container.innerHTML = "";

  mobiles.forEach(mobile => {
    const card = `
      <div class="mobile-card" onclick="window.location.href='/product?id=${mobile.id}'">
        <img src="/uploads/products/${mobile.image}" />
        <h4>${mobile.name}</h4>
        <p>₹${mobile.price}</p>
      </div>
    `;

    container.innerHTML += card;
  });
}

function loadAllProducts() {
  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => {
      console.log("All Products:", data);
      displayAllProducts(data);
    })
    .catch(err => console.log(err));
}

// CALL IT
loadRelatedMobiles();
loadRelatedBrand();
loadAllProducts();

document.querySelectorAll(".scroll-container").forEach(container => {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => isDown = false);
  container.addEventListener("mouseup", () => isDown = false);

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
});

async function wishList() {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) return;

  window.location.href = "/user/wishlist.html";
}

async function handleWishlist() {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const res = await fetch("/api/wishlist/add", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ product_id: productId })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Added to wishlist ❤️");
  } else {
    alert(data.message || "Error");
  }
}
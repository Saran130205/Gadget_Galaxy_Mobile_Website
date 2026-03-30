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
  });

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

function gotoCart() {
    window.location.href = "/user/cart.html";
}

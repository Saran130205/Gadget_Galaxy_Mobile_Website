document.addEventListener("DOMContentLoaded", function () {

  //  TRENDING
  fetch("/api/trending-mobiles")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("trendingMobiles");
      let html = "";
      products.forEach((product) => {
        html += `
        <div class="product-card" onclick="visitProduct(${product.id})">
          <img src="/uploads/products/${product.image}" style="width:150px">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        </div>
        `;
      });
      container.innerHTML = html;
    });

  //  NEW ARRIVALS
  fetch("/api/new-arrivals")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("newArrivals");
      let html = "";
      products.forEach((product) => {
        html += `
        <div class="product-card" onclick="visitProduct(${product.id})">
          <img src="/uploads/products/${product.image}" style="width:150px">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        </div>
        `;
      });
      container.innerHTML = html;
    });

  //  TOP SELLING (FIXED CLICK)
  fetch("/api/top-selling")
    .then(res => res.json())
    .then(products => {

      const container = document.getElementById("topSellingContainer");

      if (!container) return;

      container.innerHTML = "";

      if (!Array.isArray(products)) {
        console.log("Invalid data:", products);
        return;
      }

      products.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        //  FIX: CLICK ADDED
        card.onclick = () => visitProduct(product.id);

        card.innerHTML = `
          <img src="/uploads/products/${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        `;

        container.appendChild(card);
      });

    });

  //  FEATURED / ALL PRODUCTS
  fetch("/api/products")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("productContainer");
      let html = "";
      products.forEach((product) => {
        html += `
        <div class="product-card" onclick="visitProduct(${product.id})">
          <img src="/uploads/products/${product.image}" style="width:150px">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        </div>
        `;
      });
      container.innerHTML = html;
    })
    .catch((error) => console.log(error));

  //  BANNERS
  fetch("/api/banners")
    .then((res) => res.json())
    .then((banners) => {
      const slider = document.getElementById("bannerSlider");
      let html = "";

      banners.forEach((banner) => {
        html += `<img src="/uploads/banners/${banner.image}" alt="${banner.title}">`;
      });

      slider.innerHTML = html + html;
      startSlider();
    });

  function startSlider() {
    const slider = document.getElementById("bannerSlider");
    let scrollPosition = 0;

    setInterval(() => {
      scrollPosition += 1;
      slider.style.transform = `translateX(-${scrollPosition}px)`;

      if (scrollPosition >= slider.scrollWidth / 2) {
        scrollPosition = 0;
      }
    }, 20);
  }

  //  HIGHLY VISITED
  fetch("/api/highly-visited")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("highlyVisitedContainer");
      let html = "";
      products.forEach((product) => {
        html += `
        <div class="product-card" onclick="visitProduct(${product.id})">
          <img src="/uploads/products/${product.image}" style="width:150px">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        </div>
        `;
      });
      container.innerHTML = html;
    });

});

//  AUTO SCROLL FEATURED
const scrollContainer = document.querySelector(".product-scroll");

let scrollAmount = 0;

setInterval(() => {
  if (!scrollContainer) return;

  scrollAmount += 1;
  scrollContainer.scrollLeft = scrollAmount;

  if (
    scrollAmount >=
    scrollContainer.scrollWidth - scrollContainer.clientWidth
  ) {
    scrollAmount = 0;
  }
}, 20);

function gotoCart() {
    window.location.href = "/user/cart.html";
}
//  BRAND LOAD
function loadBrand(brand) {
  fetch(`/api/brand/${brand}`)
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("productContainer");
      let html = "";
      products.forEach((product) => {
        html += `
        <div class="product-card" onclick="visitProduct(${product.id})">
          <img src="/uploads/products/${product.image}" style="width:150px">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        </div>
        `;
      });
      container.innerHTML = html;
    });
}


//  VISIT PRODUCT (VERY IMPORTANT)
function visitProduct(id) {
  fetch(`/api/product-view/${id}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then(() => {
      window.location.href = "/product?id=" + id;
    })
    .catch((err) => console.log(err));
}


//  SEARCH
function searchProducts() {
  const query = document.getElementById("searchInput").value;
  window.location.href = "/brand?name=" + query;
}


//  BRAND NAVIGATION
function goToBrand(brand) {
  window.location.href = "/brand?name=" + brand;
}


//  DISPLAY (OPTIONAL)
function displayProducts(products) {
  const container = document.getElementById("productContainer");

  container.innerHTML = "";

  products.forEach((product) => {
    container.innerHTML += `
    <div class="mobile-card" onclick="visitProduct(${product.id})">
      <img src="/uploads/products/${product.image}" width="150">
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
    </div>
    `;
  });
}
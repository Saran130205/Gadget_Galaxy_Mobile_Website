document.addEventListener("DOMContentLoaded", function () {
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

  fetch("/api/new-arrivals")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("newArrivals");
      let html = "";
      products.forEach((product) => {
        html += `<div class="product-card" onclick="visitProduct(${product.id})">
            <img src="/uploads/products/${product.image}" style="width:150px">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            </div>
            `;
      });
      container.innerHTML = html;
    });

  fetch("/api/top-selling")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("topSelling");
      let html = "";
      products.forEach((product) => {
        html += `<div class="product-card" onclick="visitProduct(${product.id})">
              <img src="/uploads/products/${product.image}" style="width:150px">
              <h3>${product.name}</h3>
              <p>₹${product.price}</p>
              </div>
              `;
      });
      container.innerHTML = html;
    });

  fetch("/api/products")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("productContainer");
      let html = "";
      products.forEach((product) => {
        html += `<div class="product-card" onclick="visitProduct(${product.id})">
                <img src="/uploads/products/${product.image}" style="width:150px">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
                </div>
                `;
      });
      container.innerHTML = html;
    })
    .catch((error) => console.log(error));

  fetch("/api/banners")
    .then((res) => res.json())
    .then((banners) => {
      const slider = document.getElementById("bannerSlider");
      let html = "";
      banners.forEach((banner) => {
        html += `
            <img src="/uploads/banners/${banner.image}" alt="${banner.title}">
            `;
      });
      slider.innerHTML = html;
    });

  // function visitProduct(id) {
  //   fetch(`/api/product-view/${id}`, {
  //     method: "POST",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("view updated");
  //       window.location.href = "/product?id=" + id;
  //       loadHighlyVisited();
  //     });
  // }

  // LOAD TRENDING MOBILES

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

  // function goToBrand(brand) {
  //   fetch("/api/products/brand/" + brand)
  //     .then((res) => res.json())

  //     .then((products) => {
  //       displayProducts(products);
  //     })

  //     .catch((err) => console.log(err));
  // }

  //   function displayProducts(products) {
  //     const container = document.getElementById("productContainer");

  //     container.innerHTML = "";

  //     products.forEach((product) => {
  //       container.innerHTML += `
  // <div class="mobile-card" onclick="visitProduct(${product.id})">

  // <img src="/uploads/products/${product.image}" width="150">

  // <h4>${product.name}</h4>

  // <p>₹${product.price}</p>

  // </div>
  // `;
  //     });
  //   }

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

function loadHighlyVisited() {
  fetch("/api/highly-visited")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("highlyVisitedContainer");
      let html = "";
      products.forEach((product) => {
        html += `<div class="product-card" onclick="visitProduct(${product.id})">
                        <img src="/uploads/products/${product.image}" style="width:150px">
                        <h3>${product.name}</h3>
                        <p>₹${product.price}</p>
                        </div>`;
      });
      container.innerHTML = html;
    });
}

function visitProduct(id) {
  fetch(`/api/product-view/${id}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("view updated");

      window.location.href = "/product?id=" + id;
    })
    .catch((err) => console.log(err));
}

function searchProducts() {
  const query = document.getElementById("searchInput").value;

  window.location.href = "/brand?name=" + query;
}

function goToBrand(brand) {
  window.location.href = "/brand?name=" + brand;
}

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

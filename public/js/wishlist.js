
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
  <div class="mobile-card">

    <img onclick="goToProduct(${product.id})"
         src="/uploads/products/${product.image}" />

    <h4>${product.name}</h4>
    <p>₹${product.price}</p>

   

    <button class="remove-btn"
        onclick="removeFromWishlist(${product.id})">
        Remove
    </button>

  </div>
`).join("");
}

function goToProduct(id) {
  window.location.href = `/product?id=${id}`;
}

// function increaseQty(id) {
//   let qtyElement = document.getElementById(`qty-${id}`);
//   let qty = parseInt(qtyElement.innerText);
//   qty++;
//   qtyElement.innerText = qty;
// }

// function decreaseQty(id) {
//   let qtyElement = document.getElementById(`qty-${id}`);
//   let qty = parseInt(qtyElement.innerText);

//   if (qty > 1) {
//     qty--;
//     qtyElement.innerText = qty;
//   }
// }

async function removeFromWishlist(id) {
  await fetch(`/api/wishlist/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  loadWishlist(); // reload after remove
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
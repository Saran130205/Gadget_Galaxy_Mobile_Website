//  CHECK LOGIN USING SESSION
async function checkLogin() {
    const res = await fetch("/api/me", {
    credentials: "include"
    });
    const data = await res.json();

    if (!data.user) {
        alert("Please login first!");
        window.location.href = "/login";
    }
}

//  LOAD CART FROM BACKEND
async function loadCheckout() {

    const res = await fetch("/api/cart", {
    credentials: "include"
});
    const cartItems = await res.json();

    const table = document.getElementById("checkoutItems");
    const totalPriceEl = document.getElementById("totalPrice");

    table.innerHTML = "";

    let total = 0;

    // 🔥 FIX: handle empty cart
    if (!cartItems || cartItems.length === 0) {
        table.innerHTML = `<tr><td colspan="4">Cart is empty</td></tr>`;
        totalPriceEl.innerText = 0;
        return;
    }

    cartItems.forEach(item => {

        const row = `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price * item.quantity}</td>
            </tr>
        `;

        table.innerHTML += row;

        total += item.price * item.quantity;
    });

    totalPriceEl.innerText = total;
}

//  PLACE ORDER
async function placeOrder() {

    // 🔥 FIX: define table here
    const table = document.getElementById("checkoutItems");

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const pincode = document.getElementById("pincode").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;

    if (!name || !address || !pincode || !mobile || !email) {
        alert("Please fill all details");
        return;
    }

    try {
        const cartRes = await fetch("/api/cart", {
        credentials: "include"
        });
        const cartItems = await cartRes.json();

        if (!cartItems || cartItems.length === 0) {
            table.innerHTML = `<tr><td colspan="4">Cart is empty</td></tr>`;
            document.getElementById("totalPrice").innerText = 0;
            return;
        }

        let total_price = 0;
        cartItems.forEach(item => {
            total_price += item.price * item.quantity;
        });

        const res = await fetch("/api/place-order", {
            method: "POST",
            credentials: "include",   // 🔥 ADD THIS
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                address,
                pincode,
                mobile,
                email,
                total_price,
                cartItems
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Order placed successfully!");

            // CLEAR CART
            await fetch("/api/cart/clear", {
                method: "DELETE",
                credentials: "include"   // 🔥 ADD THIS
            });

            window.location.href = "/user/order-placed.html";
        } else {
            alert(data.message || "Error placing order");
        }

    } catch (err) {
        console.error("Order Error:", err);
        alert("Something went wrong");
    }
}

//  RUN ON PAGE LOAD
window.addEventListener("DOMContentLoaded", async () => {
    await checkLogin();
    await loadCheckout();
});
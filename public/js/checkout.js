const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please login to continue checkout");
    window.location.href = "/login.html";
}

const table = document.getElementById("checkoutItems");

// ✅ Load checkout items
fetch("/api/cart")
.then(res => res.json())
.then(data => {

    let total = 0;
    table.innerHTML = ""; // clear before adding

    data.forEach(item => {

        let row = `
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

    document.getElementById("totalPrice").innerText = total;
})
.catch(err => {
    console.error("Cart fetch error:", err);
});


async function placeOrder() {

    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ BLOCK IF NOT LOGGED IN
    if (!user) {
        alert("Login required!");
        window.location.href = "/login.html";
        return;
    }

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
        const cartRes = await fetch("/api/cart");
        const cartItems = await cartRes.json();

        if (!cartItems || cartItems.length === 0) {
            alert("Cart is empty");
            return;
        }

        let total_price = 0;
        cartItems.forEach(item => {
            total_price += item.price * item.quantity;
        });

        const res = await fetch("/api/place-order", {
            method: "POST",
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
            alert("Order placed successfully");

            await fetch("/api/cart/clear", { method: "DELETE" });

            window.location.href = "/user/order-placed.html";
        } else {
            alert(data.message || "Error placing order");
        }

    } catch (err) {
        console.error("Order Error:", err);
        alert("Something went wrong");
    }
}
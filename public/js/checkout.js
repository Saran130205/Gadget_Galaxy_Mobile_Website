// ✅ RUN ONLY AFTER PAGE LOAD
window.addEventListener("load", () => {

    const user = localStorage.getItem("user");

    // 🔐 CHECK LOGIN
    if (!user || user === "undefined" || user === "null") {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        window.location.href = "/login.html";
    }

});


// ✅ PLACE ORDER FUNCTION
async function placeOrder() {

    let user = null;

try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (e) {
    user = null;
}

//  STRICT CHECK
if (!user || !user.id) {
    alert("Login required!");

    localStorage.setItem("redirectAfterLogin", window.location.href);
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
                userId: user.id,
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
fetch("/api/orders")
.then(res => {
    if (!res.ok) {
        throw new Error("Failed to fetch orders");
    }
    return res.json();
})
.then(data => {

    console.log("Orders Data:", data); // 👈 DEBUG

    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    if (data.length === 0) {
        table.innerHTML = "<tr><td colspan='7'>No orders found</td></tr>";
        return;
    }

    data.forEach(order => {

        const row = `
        <tr>
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>${order.mobile}</td>
            <td>${order.address}</td>
            <td>${order.product_name}</td>
            <td>${order.quantity}</td>
            <td>₹${order.total}</td>
        </tr>
        `;

        table.innerHTML += row;
    });

})
.catch(err => {
    console.error("Fetch Error:", err);
});
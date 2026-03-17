const table = document.getElementById("checkoutItems");

fetch("/api/cart")
.then(res=>res.json())
.then(data=>{

let total = 0;

data.forEach(item=>{

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

});

function placeOrder(){

  const confirmOrder = confirm("Are you sure you want to place the order?");

  if(!confirmOrder) return;

 fetch("/api/order/place",{
    method:"POST"
  })
  .then(res => res.json())
  .then(data => {

    // ✅ redirect after success
    window.location.href = "/user/order-place.html";

  })
  .catch(err=>{
    console.log(err);
    alert("Something went wrong");
  });

}

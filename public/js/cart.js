const cartTable = document.getElementById("cartTable");

fetch("/api/cart")
.then(res=>res.json())
.then(data=>{
let total = 0;
cartTable.innerHTML = "";
data.forEach(item=>{
let row = `
<tr>
<td>
<img src="/uploads/${item.image}" width="80">
${item.name}
</td>
<td>₹${item.price}</td>
<td>${item.quantity}</td>
<td>₹${item.price * item.quantity}</td>
<td>
<button onclick="removeItem(${item.id})">Remove</button>
</td>
</tr>
`;
cartTable.innerHTML += row;
total += item.price * item.quantity;
});
document.getElementById("totalPrice").innerText = total;
});

document.addEventListener("click", function(e){

if(e.target.classList.contains("addToCartBtn")){

const productId = e.target.dataset.id;

fetch("/api/cart/add",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
product_id: productId
})
})
.then(res=>res.json())
.then(data=>{
alert("Product added to cart");
});

}

});

function removeCart(id) {
  fetch("/api/cart/remove/" + id, {
    method: "DELETE",
  }).then(() => {
    location.reload();
  });
}

function removeCart(id) {
  fetch("/api/cart/remove/" + id, {
    method: "DELETE",
  }).then(() => {
    location.reload();
  });
}

function removeItem(id) {
  fetch("/api/cart/remove/" + id, {
    method: "DELETE",
  }).then(() => {
    location.reload();
  });
}

function increaseQty(id){

fetch("/api/cart/increase/" + id,{
method:"PUT"
})
.then(res=>res.json())
.then(()=>{
location.reload();
});

}

function decreaseQty(id){
fetch("/api/cart/decrease/" + id,{
method:"PUT"
})
.then(res=>res.json())
.then(()=>{
location.reload();
});
}


function checkout(){
const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Login first!");
        localStorage.setItem("redirectAfterLogin", "/checkout.html");
        window.location.href = "/login.html";
    } else {
        window.location.href = "/checkout.html";
    }
}
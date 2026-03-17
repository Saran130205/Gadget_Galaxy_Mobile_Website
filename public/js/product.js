const params = new URLSearchParams(window.location.search);
const id = params.get("id");

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




function addToCart(){

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

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
alert("Product Added to Cart");
window.location.href = "/cart";
console.log(data);
})
.catch(err=>console.log(err));

}
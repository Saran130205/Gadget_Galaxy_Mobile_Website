const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/cart",(req,res)=>{

const sql = `
SELECT 
products.id,
products.name,
products.price,
products.image,
cart.quantity
FROM cart
JOIN products 
ON cart.product_id = products.id
WHERE cart.user_id = 1
`;

db.query(sql,(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json(result);

});

});
router.post("/cart/add",(req,res)=>{

const { product_id } = req.body;
const userId = 1;

const checkSql =
"SELECT * FROM cart WHERE product_id=? AND user_id=?";

db.query(checkSql,[product_id,userId],(err,result)=>{

if(result.length > 0){

const updateSql =
"UPDATE cart SET quantity = quantity + 1 WHERE product_id=? AND user_id=?";

db.query(updateSql,[product_id,userId],()=>{

res.json({message:"Quantity updated"});

});

}
else{

const insertSql =
"INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)";

db.query(insertSql,[userId,product_id],()=>{

res.json({message:"Product added"});

});
}
});
});


router.delete("/cart/remove/:id", (req, res) => {
  const productId = req.params.id;
  const userId = 1;

  const sql = "DELETE FROM cart WHERE product_id=? AND user_id=?";

  db.query(sql, [productId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }

    res.json({ message: "Item removed" });
  });
});

router.put("/cart/increase/:id",(req,res)=>{

const id = req.params.id;

const sql = "UPDATE cart SET quantity = quantity + 1 WHERE id=?";

db.query(sql,[id],(err,result)=>{

if(err) return res.status(500).json(err);

res.json({message:"Quantity increased"});

});

});


// decrease quantity
router.put("/cart/decrease/:id",(req,res)=>{

const id = req.params.id;

const sql = "UPDATE cart SET quantity = quantity - 1 WHERE id=? AND quantity > 1";

db.query(sql,[id],(err,result)=>{

if(err) return res.status(500).json(err);

res.json({message:"Quantity decreased"});

});

});

module.exports = router;

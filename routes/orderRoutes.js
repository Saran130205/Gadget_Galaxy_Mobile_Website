const express = require("express");
const router = express.Router();
const db = require("../database/db");

// PLACE ORDER
router.post("/place-order", (req, res) => {

  const { userId, name, address, pincode, mobile, email, total_price, cartItems } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Login required" });
  }

  // STEP 1: insert order
  const orderSql = `
  INSERT INTO orders (name, address, pincode, mobile, email, total_price)
  VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(orderSql, [name, address, pincode, mobile, email, total_price], (err, result) => {

    if (err) {
      console.log("ORDER ERROR:", err);
      return res.status(500).json(err);
    }

    const orderId = result.insertId;

    // STEP 2: insert order items
    const items = cartItems.map(item => [
      orderId,
      item.product_id,   // make sure this exists in cart
      item.quantity
    ]);

    const itemSql = `
    INSERT INTO order_items (order_id, product_id, quantity)
    VALUES ?
    `;

    db.query(itemSql, [items], (err2) => {

      if (err2) {
        console.log("ITEM ERROR:", err2);
        return res.status(500).json(err2);
      }

      
      db.query("DELETE FROM cart WHERE user_id=?", [userId]);

      res.json({ message: "Order placed successfully" });
    });
  });
});
module.exports = router;

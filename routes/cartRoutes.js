const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.post("/cart/add", (req, res) => {
  const { productId } = req.body;

  req.session.user.id;

  const sql = "INSERT INTO cart (user_id,product_id,quantity) VALUES (?,?,1)";

  db.query(sql, [userId, productId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }

    res.json({ message: "Added to cart" });
  });
});

router.get("/cart", (req, res) => {
  const userId = 1;

  const sql = `
SELECT products.id, products.name, products.price, products.image, cart.quantity
FROM cart
JOIN products ON cart.product_id = products.id
WHERE cart.user_id = ?
`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }

    res.json(result);
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

module.exports = router;

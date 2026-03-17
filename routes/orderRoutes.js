const express = require("express");
const router = express.Router();
const db = require("../database/db");

// PLACE ORDER
router.post("/order/place", (req, res) => {
  const userId = 1;

  const sql = `
INSERT INTO orders (user_id, product_id, quantity)
SELECT user_id, product_id, quantity
FROM cart
WHERE user_id=?
`;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    // clear cart
    db.query("DELETE FROM cart WHERE user_id=?", [userId]);

    res.json({ message: "Order placed successfully" });
  });
});

module.exports = router;

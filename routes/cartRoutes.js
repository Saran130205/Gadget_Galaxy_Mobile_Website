const express = require("express");
const router = express.Router();
const db = require("../database/db");


//  GET CART ITEMS
router.get("/cart", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: "Login required" });
    }

    const userId = req.session.user.id;

    const sql = `
        SELECT 
            cart.id,
            products.id AS product_id,
            products.name,
            products.price,
            products.image,
            cart.quantity
        FROM cart
        JOIN products 
        ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
});


//  ADD TO CART
router.post("/cart/add", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: "Login required" });
    }

    const userId = req.session.user.id;
    const { product_id, quantity } = req.body;

    const checkSql = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";

    db.query(checkSql, [userId, product_id], (err, result) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.length > 0) {
            // SAME PRODUCT → increase qty
            const updateSql = `
                UPDATE cart 
                SET quantity = quantity + ? 
                WHERE user_id = ? AND product_id = ?
            `;

            db.query(updateSql, [quantity, userId, product_id], (err2) => {

                if (err2) {
                    return res.status(500).json({ error: err2.message });
                }

                res.json({ message: "Quantity updated" });
            });

        } else {
            //  NEW PRODUCT → insert
            const insertSql = `
                INSERT INTO cart (user_id, product_id, quantity) 
                VALUES (?, ?, ?)
            `;

            db.query(insertSql, [userId, product_id, quantity], (err3) => {

                if (err3) {
                    return res.status(500).json({ error: err3.message });
                }

                res.json({ message: "Added to cart" });
            });
        }

    });
});


//  REMOVE ITEM
router.delete("/cart/remove/:id", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: "Login required" });
    }

    const productId = req.params.id;
    const userId = req.session.user.id;

    const sql = "DELETE FROM cart WHERE product_id=? AND user_id=?";

    db.query(sql, [productId, userId], (err) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }

        res.json({ message: "Item removed" });
    });
});


//  INCREASE QUANTITY
router.put("/cart/increase/:id", (req, res) => {

    const id = req.params.id;

    const sql = "UPDATE cart SET quantity = quantity + 1 WHERE id=?";

    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Quantity increased" });
    });
});


//  DECREASE QUANTITY
router.put("/cart/decrease/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE cart 
        SET quantity = quantity - 1 
        WHERE id=? AND quantity > 1
    `;

    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Quantity decreased" });
    });
});


//  CLEAR CART (FIX FOR YOUR ERROR 🔥)
router.delete("/cart/clear", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: "Login required" });
    }

    const userId = req.session.user.id;

    const sql = "DELETE FROM cart WHERE user_id = ?";

    db.query(sql, [userId], (err) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Cart cleared" });
    });
});


module.exports = router;
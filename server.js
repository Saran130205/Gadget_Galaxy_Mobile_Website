const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const db = require("./database/db");

app.use(
  session({ secret: "gadgetgalaxy", resave: false, saveUninitialized: false }),
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use(express.static("public"));
app.use(express.static("views/user"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use("/uploads/banners", express.static("uploads/banners"));
app.use("/uploads/products", express.static("uploads/products")); 
// app.use(session({secret: "gadgetgalaxy", resave: false, saveUninitialized: true }));

app.use("/api", authRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
// app.use("/uploads", express.static("uploads"));

// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/api", productRoutes);

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/user/index.html"));
});

// Admin pages
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/dashboard.html"));
});

app.get("/admin/add-product", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/add-product.html"));
});

app.get("/brand", (req, res) => {
  res.sendFile(path.join(__dirname, "views/user/brand.html"));
});

app.get("/admin/banner", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/banner.html"));
});

app.get("/product", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/user/product.html"));
});

app.get("/user/product.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views/user/product.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/user/login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/user/signup.html"));
});

app.get("/user/cart.html", (req, res) => {
  res.sendFile(__dirname + "/views/user/cart.html");
});

app.get("/checkout", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.sendFile(__dirname + "/views/user/checkout.html");
});

app.get("/user/order-placed.html", (req, res) => {
  res.sendFile(__dirname + "/views/user/order-placed.html");
});

app.get("/api/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get("/admin/manage-product", (req, res) => {
    res.sendFile(path.join(__dirname, "views/admin/manage-product.html"));
});

// UPDATE
app.put("/api/product/:id", (req, res) => {

    const id = req.params.id;
    const { name, brand, price } = req.body;

    const sql = `
        UPDATE products 
        SET name = ?, brand = ?, price = ?
        WHERE id = ?
    `;

    db.query(sql, [name, brand, price, id], (err, result) => {

        if (err) {
            console.error("Update Error:", err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Updated successfully" });
    });
});

// DELETE
app.delete("/api/product/:id", (req, res) => {
    const id = parseInt(req.params.id);
    console.log("Deleting ID:", id); // DEBUG
    if (!id) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("MYSQL ERROR:", err); // 🔥 SEE THIS IN TERMINAL
            return res.status(500).json({ error: err.message });
        }
        console.log("Result:", result);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Deleted successfully" });
    });
});

app.post("/api/place-order", (req, res) => {
    // 🔥 ALTER: remove strict login block
    const user = req.session.user || null;
    const { name, address, pincode, mobile, email, total_price, cartItems } = req.body;
    console.log("Incoming Order:", req.body); // DEBUG
    const orderSql = `
        INSERT INTO orders (name, address, pincode, mobile, email, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(orderSql, [name, address, pincode, mobile, email, total_price], (err, result) => {
        if (err) {
            console.error("Order Insert Error:", err);
            return res.status(500).json({ error: err.message });
        }
        const orderId = result.insertId;
        const values = cartItems.map(item => [
            orderId,
            item.name,
            item.price,
            item.quantity,
            item.price * item.quantity
        ]);
        const itemsSql = `
            INSERT INTO order_items (order_id, product_name, price, quantity, total)
            VALUES ?
        `;
        db.query(itemsSql, [values], (err2) => {
            if (err2) {
                console.error("Items Insert Error:", err2);
                return res.status(500).json({ error: err2.message });
            }
            res.json({ message: "Order placed successfully" });
        });
    });
});
// console.log("Cart Items:", cartItems);

app.get("/api/orders", (req, res) => {
    const sql = `
        SELECT o.*, oi.product_name, oi.quantity, oi.total
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        ORDER BY o.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get("/admin/orders", (req, res) => {
    res.sendFile(path.join(__dirname, "views/admin/orders.html"));
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Admin running on http://localhost:5000/admin");
});

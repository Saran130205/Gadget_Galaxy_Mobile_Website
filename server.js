const express = require("express");
const path = require("path");
// const productRoutes = require("../routes/productRoutes");

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

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

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
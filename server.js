const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");



app.use(session({secret: "gadgetgalaxy", resave: false, saveUninitialized: true}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
// app.use(session({secret: "gadgetgalaxy", resave: false, saveUninitialized: true }));

app.use("/api", authRoutes);
app.use("/api", cartRoutes);

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

app.get("/admin/banner", (req, res)=>{
    res.sendFile(path.join(__dirname,"views/admin/banner.html"));
});

app.get("/product", (req, res)=>{
    res.sendFile(path.join(__dirname + "/views/user/product.html"));
});

app.get("/login",(req,res)=>{
res.sendFile(path.join(__dirname,"views/user/login.html"));
});

app.get("/signup",(req,res)=>{
res.sendFile(path.join(__dirname,"views/user/signup.html"));
});

app.get("/cart",(req,res)=>{
res.sendFile(path.join(__dirname,"views/user/cart.html"));
});


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
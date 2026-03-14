const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../database/db");

// const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/add-product", upload.single("image"), (req, res) => {
  const { name, brand, price, description } = req.body;
  const image = req.file.filename;

  const sql =
    "INSERT INTO products (name, brand, price, description, image) VALUES (?,?,?,?,?)";
  db.query(sql, [name, brand, price, description, image], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error adding product");
    } else {
      res.send("Product Added Successfully");
    }
  });
});

router.get("/products", (req, res)=>{
  const sql = "SELECT * FROM products";
  db.query(sql ,(err, result)=>{
    if (err){
      connect.log(err);
      res.status(500).json({error: "Database Error"});
    } else {
      res.json(result);
    }
  });
});

router.post("/product-view/:id", (req, res)=>{
  const id = req.params.id;
  const sql = "UPDATE products SET views = views + 1 WHERE ID = ?";
  db.query(sql,[id], (err, result)=>{
    if(err){
      console.log(err);
      res.status(500).json({error: "Database Error"});
    } else {
      res.json({message: "View Count"});
    }
  });
});

router.get("/highly-visited", (req, res)=>{
  const sql = "SELECT * FROM products ORDER BY views DESC LIMIT 4";
  db.query(sql,(err, result)=>{
    if(err){
      console.log(err);
      console.log(500).json({error:"Database Error"});
    } else {
      res.json(result);
    }
  });
});

router.get("/brand/:brand", (req, res) => {

  const brand = req.params.brand;

  const sql = "SELECT * FROM products WHERE brand = ?";

  db.query(sql, [brand], (err, result) => {

    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database Error" });
    } else {
      res.json(result);
    }

  });

});

module.exports = router;

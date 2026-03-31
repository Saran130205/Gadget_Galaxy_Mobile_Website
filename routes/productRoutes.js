const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../database/db");

// const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");
  },

  // destination: function (req, file, cb){
  //   cb(null, "uploads/banners");
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/add-product", upload.single("image"), (req, res) => {
  const {
    name,
    brand,
    price,
    description,
    battery,
    ram,
    storage,
    display,
    processor,
    camera,
    os,
    network,
  } = req.body;

  const image = req.file.filename;

  // insert into products table

  const productSql =
    "INSERT INTO products (name, brand, price, description, image) VALUES (?,?,?,?,?)";

  db.query(
    productSql,
    [name, brand, price, description, image],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Product insert error");
      }

      // get inserted product id

      const productId = result.insertId;

      // insert specifications

      const specSql = `INSERT INTO product_specs
(product_id,battery,ram,storage,display,processor,camera,os,network)
VALUES (?,?,?,?,?,?,?,?,?)`;

      db.query(
        specSql,
        [
          productId,
          battery,
          ram,
          storage,
          display,
          processor,
          camera,
          os,
          network,
        ],
        (err2, result2) => {
          if (err2) {
            console.log(err2);
            return res.status(500).send("Specs insert error");
          }

          res.send("Product added successfully");
        },
      );
    },
  );
});

router.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database Error" });
    } else {
      res.json(result);
    }
  });
});

router.post("/product-view/:id", (req, res) => {
  const id = req.params.id;

  const sql =
    "UPDATE products SET views = views + 1, last_viewed = NOW() WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ message: "view updated" });
    }
  });
});

router.get("/trending-mobiles", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY views DESC LIMIT 5";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(result);
    }
  });
});

router.get("/products/brand/:brand", (req, res) => {
  const brand = req.params.brand;

  const sql = "SELECT * FROM products WHERE brand=?";

  db.query(sql, [brand], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }

    res.json(result);
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

router.post("/add-banner", upload.single("image"), (req, res) => {
  const image = req.file.filename;
  const title = req.body.title;
  const sql = "INSERT INTO banners (image,title) VALUES (?,?)";

  db.query(sql, [image, title], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error uploading banner");
    } else {
      res.send("Banner added successfully");
    }
  });
});

router.get("/banners", (req, res) => {
  const sql = "SELECT * FROM banners";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "DB error" });
    } else {
      res.json(result);
    }
  });
});

router.get("/trending-mobiles", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY views DESC LIMIT 4";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(result);
    }
  });
});

router.get("/new-arrivals", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC LIMIT 4";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(result);
    }
  });
});

router.get("/top-selling", (req, res) => {

  const sql = `
    SELECT 
        p.id,
        p.name,
        p.price,
        p.image,
        SUM(oi.quantity) AS total_sales
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.id, p.name, p.price, p.image
    ORDER BY total_sales DESC
    LIMIT 4;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("🔥 SQL ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });

});http://localhost:5000/api/top-selling

router.get("/highly-visited", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY views DESC LIMIT 4";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database Error" });
    } else {
      res.json(result);
    }
  });
});

router.get("/products/search", (req, res) => {
  const q = req.query.q;

  const sql = "SELECT * FROM products WHERE name LIKE ?";

  db.query(sql, ["%" + q + "%"], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }

    res.json(result);
  });
});

router.get("/product/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
SELECT p.*, s.battery, s.ram, s.storage, s.display,
       s.processor, s.camera, s.os, s.network
FROM products p
LEFT JOIN product_specs s
ON p.id = s.product_id
WHERE p.id = ?
`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    res.json(result[0]);
  });
});

// RELATED MOBILES BASED ON RAM
router.get("/related/:id", (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT p.*, s.ram
    FROM products p
    JOIN product_specs s ON p.id = s.product_id
    WHERE s.ram = (
        SELECT ram FROM product_specs WHERE product_id = ?
    )
    AND p.id != ?
    LIMIT 4
  `;

  db.query(sql, [productId, productId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "DB error" });
    }

    res.json(result);
  });
});

router.get("/related-brand/:id", (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT p.*
    FROM products p
    JOIN products p2 ON p2.id = ?
    WHERE LOWER(TRIM(p.brand)) = LOWER(TRIM(p2.brand))
    AND p.id != ?
    LIMIT 4
  `;

  db.query(sql, [productId, productId], (err, result) => {
    if (err) {
      console.log("Brand error:", err);
      return res.status(500).json({ error: "DB error" });
    }

    console.log("Brand Related:", result);
    res.json(result);
  });
});


module.exports = router;

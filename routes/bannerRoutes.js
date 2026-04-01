const express = require("express");
const router = express.Router();
const db = require("../database/db");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

/* ========= MULTER CONFIG (FIX 🔥) ========= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/banners/"); // ✅ correct folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ========= GET BANNERS ========= */
router.get("/banners", (req, res) => {
  const sql = "SELECT * FROM banners";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database error" });
    }

    const validBanners = result
      .map((banner) => {
        if (!banner.image) return null;

        const filePath = path.join(
          __dirname,
          "../uploads/banners",
          banner.image,
        );

        if (fs.existsSync(filePath)) {
          return {
            ...banner,
            image: `/uploads/banners/${banner.image}`,
          };
        }

        return null;
      })
      .filter((b) => b !== null);

    res.json(validBanners);
  });
});

/* ========= ADD BANNER ========= */
router.post("/add-banner", upload.single("image"), (req, res) => {
  const title = req.body.title;
  const image = req.file.filename;

  const sql = "INSERT INTO banners (title, image) VALUES (?, ?)";

  db.query(sql, [title, image], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB error" });
    }

    res.json({ message: "Banner uploaded successfully" });
  });
});

module.exports = router;

const fs = require("fs");
const path = require("path");

router.get("/banners", (req, res) => {
    const sql = "SELECT * FROM banners";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        const validBanners = result.filter(banner => {
            if (!banner.image) return false;
            // 🔥 remove '/uploads/' if present
            const fileName = banner.image.replace("/uploads/", "");
            const filePath = path.join(__dirname, "../uploads", fileName);
            return fs.existsSync(filePath);
        });
        res.json(validBanners);
    });
});
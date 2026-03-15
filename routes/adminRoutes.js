const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/banners/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post("/admin/upload-banner", upload.single("image"), (req, res) => {

  const title = req.body.title;
  const image = req.file.filename;

  const sql = "INSERT INTO banners (title,image) VALUES (?,?)";

  db.query(sql, [title, image], (err, result) => {
    if(err){
      console.log(err);
      res.send("Database error");
    }else{
      res.send("Banner uploaded successfully");
    }
  });

});


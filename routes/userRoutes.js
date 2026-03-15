router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Signup Error");
    }

    res.send("Signup successful");
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Login Error");
    }

    if (result.length > 0) {
      req.session.user = result[0];

      res.json({
        message: "Login successful",
        user: result[0],
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

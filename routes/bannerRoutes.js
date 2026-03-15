router.get("/banners", (req, res)=> {
    const sql = "SELECT * FROM banners";
    db.query(sql,(err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({error: "Database error"});
        } else {
            res.json(result);
        }
    });
});
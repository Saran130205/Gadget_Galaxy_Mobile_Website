const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SARAN1302",
    database: "gadget_galaxy"
});


db.connect((err)=>{
    if(err){
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("MySql DB Connected");

    }
});

module.exports = db;
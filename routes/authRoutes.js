const express = require("express");
const router = express.Router();
const db = require("../database/db");

// SIGNUP
router.post("/signup", (req, res) => {

const { name, email, password } = req.body;

const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

db.query(sql,[name,email,password],(err,result)=>{

if(err){
console.log(err);
return res.status(500).json({message:"Signup error"});
}

res.json({message:"Signup successful"});

});

});

// LOGIN
router.post("/login",(req,res)=>{

const {email,password} = req.body;

const sql = "SELECT * FROM users WHERE email=? AND password=?";

db.query(sql,[email,password],(err,result)=>{

if(err){
return res.status(500).json({message:"Server error"});
}

if(result.length>0){

req.session.user = result[0];

res.json({
message:"Login successful",
user: result[0]
});

}else{

res.status(401).json({message:"Invalid email or password"});

}

});

});

// GET CURRENT USER
router.get("/me",(req,res)=>{

if(req.session.user){
res.json({user:req.session.user});
}else{
res.json({user:null});
}

});

// LOGOUT
router.get("/logout",(req,res)=>{

req.session.destroy();
res.json({message:"Logged out"});

});

module.exports = router;
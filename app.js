require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");

const saltRounds = 10;
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const User = new mongoose.model("User",userSchema);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
    console.log("Connected to userDB");
}

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        const newUser = new User({
            email:req.body.username,
            password:hash
        });
        await newUser.save();
        res.render("secrets");
    });  
});

app.post("/login",async function (req,res){
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({email:username});
    if(foundUser){
        console.log("Found!!!");
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result===true){
                res.render("secrets");
            }
        });
    }
});

// app.listen(3000,()=>{console.log("Server started on port 3000");});
main().catch(err=>{console.log(err);});
app.listen(3000,function (){console.log("Server started on port 3000");});
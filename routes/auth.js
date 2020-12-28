const { response } = require('express');
const express=require('express');
const router =express.Router()
const mongoose=require('mongoose');
const User =mongoose.model("User");
const bcrypt =require('bcryptjs');
const jwt=require("jsonwebtoken");
const requireLogin = require('../middleware/requireLogin');
const JWT_SECRET="ererjjfdkfndfdkfjdfsaadofk";
// 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

router.get("/protected",requireLogin,(req,res)=>{
res.send("hello user");
})

router.post("/signup",(req,res)=>
{ 
    const {name,email,password,pic} =req.body
    if(!name || !email || !password)
    {
       return  res.status(400).json({error:"please add all the fields"});
    }
    bcrypt.hash(password,12).then((hashedpassword)=>{
        User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser) 
            {
            return  res.status(400).json({error:"User already existed with that email"});
            }
            const user =new User({
            email,
            password:hashedpassword,
            name,
            pic
            })
            user.save()
            .then((user)=>{
            res.json({message:"Saved Successfully"})
            })
            .catch((error)=>
            {
            console.log(error)
            })
            })
            .catch((error)=>{
                console.log(error)
            })
    })
    })

router.post("/signin",(req,res)=>{
    const {email,password} = req.body;
    if(!email ||!password)
    {
        return res.json({error:"Please add email and password"});
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser)
        {

return res.status(400).json({error:"Invalid email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then((domatch)=>{
            if(domatch){
                const {_id,name,email,followers,following,pic}= savedUser
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET);
                res.json({token,user:{_id,name,email,followers,following,pic}});
            }
            else{
                return res.status(400).json({error:"Invalid email or password"});
            }
        })
        .catch((error)=>{console.log(error)})
    })
})
module.exports =  router;
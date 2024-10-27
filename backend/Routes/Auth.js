const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const errorHandler = require('../Middleware/errorMiddleware');

//aouq mhwu wdcg botq

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'aass07112004@gmail.com',
        pass:'aouqmhwuwdcgbotq'
    }
});

router.get('/test', (req, res) => {
    res.send('Authentication system is up !!');
});

router.post('/sendOTP', async(req,res,next) => {
    const {email} =req.body;
    const otp = Math.floor(100000 + Math.random()*900000);
    try {
        const mailOptions = {
            from : process.env.COMPANY_EAMIL,
            to : email,
            subject : 'OTP for verfication of blogApp',
            text : `Your otp for verification is ${otp}` 
        };
        transporter.sendMail(mailOptions,async (err,info)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    message: err.message
                });
            }else{
                res.json({
                    message: "OTP successfully sent"
                })
            }
        });
    }catch(err){
        next(err);
    }   
});

router.post('/register', async(req,res,next) => {
    try {
        const { name, email, password } = req.body;
        const exisingUser = await User.findOne({email:email});
        if(exisingUser) res.status(409).json({error:"User already exists"});
        const newUser = new User({
            name,
            password,
            email
        });
        await newUser.save();
        res.status(201).json({message:"User registered successfully"});
    }catch(err){
        next(err);
    }   
});

router.post('/login', async(req,res,next) => {
    try {
        const {email, password } = req.body;
        const user = await User.findOne({email:email});
        if(!user) res.status(400).json({message:"Invalid name"});
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) res.status(400).json({message:"Invalid password"})

        const authToken = jwt.sign({userId: user._id},process.env.JWT_AUTH_KEY,{expiresIn:'10m'});
        const refreshToken = jwt.sign({userId: user._id},process.env.JWT_REFRESH_KEY,{expiresIn:'30m'});
        res.cookie('authToken',authToken,{httpOnly:true});
        res.cookie('refreshToken',refreshToken,{httpOnly:true});
        res.status(200).json({
            message:"Login successful",
        })
    }catch(err){
        next(err);
    }   
});

router.use(errorHandler)

module.exports = router;
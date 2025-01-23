const User = require('../models/userModel');
const {generateOtp} = require('../utils/otpGenerator');
const {sendEmail} = require('../utils/otpGenerator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt ');
require('dotenv').config();

exports.register = async(req,res) => {
    try{
        const {email,password} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({message : 'email da ton tai roi'});

        const user = await User.create({email,password});
        const otp = generateOtp();
        user.otp=otp;
        user.otpExpires=Date.now()+5*60*1000;
        await user.save();

        await sendEmail(email,'Xac nhan tai khoan','Ma otp la : ${otp}')
        res.status(201).json({message : 'Dang kt thanh cong, kiem tra email '});
    } catch (error){
        res.status(500).json({message : 'Loi',error:error.message});
    }
}

exports.verifyOtp = async(req,res)=>{
    try {
        const {email,otp} = req.body;
        const user = await User.findOne({email});
    }
}
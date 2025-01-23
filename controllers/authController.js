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

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ message: 'User không tồn tại.' });
        if (user.otp !== otp) return res.status(400).json({ message: 'OTP không hợp lệ.' });
        if (Date.now() > user.otpExpires) return res.status(400).json({ message: 'OTP đã hết hạn.' });

        user.isVerify = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'Xác thực OTP thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ message: 'User không tồn tại.' });

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendEmail(email, 'Quên mật khẩu', `Mã OTP để đặt lại mật khẩu của bạn là: ${otp}`);
        res.status(200).json({ message: 'OTP đã được gửi đến email của bạn.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ message: 'User không tồn tại.' });
        if (user.otp !== otp) return res.status(400).json({ message: 'OTP không hợp lệ.' });
        if (Date.now() > user.otpExpires) return res.status(400).json({ message: 'OTP đã hết hạn.' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi', error: error.message });
    }
};

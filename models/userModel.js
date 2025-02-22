const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{type : String,require : true,unique:true},
    password:{type : String , require : true},
    isVerify : { type : Boolean,default : false},
    otp : {type : String, default : null},
    otpExpires : {type : Date, default : null},
});

userSchema.pre('save',async function name(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

module.exports() = mongoose.model('User',userSchema)

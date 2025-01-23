const otpGenerator  = require('otp-generator');
exports.generateOtp = () => {
    return otpGenerator.generate(6,{upperCaseAlphabets:false,specialChars: false});
}
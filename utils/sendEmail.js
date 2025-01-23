const { text } = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config;
const transport = nodemailer.createTransport({
    service:'gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
    },
});
exports.sendEmail = async(to,subject,text)=>{
    try{
        await transport.sendMail({
            from:process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
    }
    catch (error){
        throw new Error("Loi gui email")
    };
}
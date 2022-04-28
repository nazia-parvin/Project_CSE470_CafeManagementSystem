const nodemailer = require('nodemailer');
require('dotenv').config();

exports = module.exports = sendEmail = (to, from, subject, body) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        to: to,
        from: from || process.env.EMAIL_USER,
        subject: subject,
        html: body
    }
    nodemailer.sendEmail(mailOptions, (err, info) => {
        if (!err) {
            return true;
        }
        else {
            console.log("Error while sending email - " + err);
            return false;            
        }
    });

}
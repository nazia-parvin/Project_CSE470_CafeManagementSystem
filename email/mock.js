const nodemailer = require('nodemailer');
require('dotenv').config();

exports = module.exports = sendEmail = async (to, from, subject, body) => {
    // Generate SMTP service account from ethereal.email
    let result = await new Promise((resolve,reject) => {
        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                reject('Failed to create a testing account.');
            }

            console.log('Credentials obtained, sending message...');

            // Create a SMTP transporter object
            let transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            // Message object
            let message = {
                from: from,
                to: to,
                subject,
                html: body
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err.message);
                    reject(err.message);
                }

                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                resolve(nodemailer.getTestMessageUrl(info));
            });
        });
    }).then((value) => {console.log(value); return value;}).catch((reason)=>{return reason;});
    return result;
}
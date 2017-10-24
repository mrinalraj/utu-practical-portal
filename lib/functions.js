let nodemailer = require('nodemailer');

module.exports.sendMail = function (email, name, callback) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });
    let mailOptions = {
        from: '"Uttarakhand Technical University" ' + process.env.SENDER_EMAIL,
        to: email,
        subject: 'Account Activated',
        text: 'Congratulations ' + name + ' Your account has been activated'
    };
    transporter
        .sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            callback(error)
        });
}
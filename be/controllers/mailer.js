const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const ENV = require('../config.js');


// https://ethereal.email/create
let nodeConfig = {
    service:'gmail', // true for 465, false for other ports
    auth: {
        user: ENV.EMAIL, // generated ethereal user
        pass: ENV.PASSWORD, // generated ethereal password
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "K-One",
        link: 'https://mailgen.js/'
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // Assuming MailGenerator and transporter are properly initialized
    try {
        // Body of the email
        var email = {
            body: {
                name: username,
                intro: text || "Welcome to K-One Gym! We're very excited to have you on board.",
                outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
            },
        };

        var emailBody = MailGenerator.generate(email);

        let message = {
            from: process.env.EMAIL, // Use process.env instead of ENV
            to: userEmail,
            subject: subject || "Signup Successful",
            html: emailBody,
        };

        // Send mail
        const info = await transporter.sendMail(message);
        return res.status(200).json({
            msg: "You should receive an email from us.",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info),
        });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};


module.exports = {
    registerMail
  };
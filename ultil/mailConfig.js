const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'thangpdhps41021@gmail.com',
        pass: 'kstd yecz kdny gaje'
    }
});


module.exports = { transporter };
const { Client, LocalAuth } = require('whatsapp-web.js');
var qrcode = require('qrcode-terminal');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({ clientId: "my-whatsapp-session" })
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone to log in
    // The QR code will be printed in the terminal
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});


client.on('ready', () => {
    console.log('Client is ready!');
});

module.exports=client
const { Client, LocalAuth } = require('whatsapp-web.js');
var qrCode = require('qrcode-terminal');
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // for low-RAM
            '--disable-gpu',
            '--disable-features=VizDisplayCompositor',]
    },
    authStrategy: new LocalAuth({ clientId: "my-whatsapp-session" })
});

client.on('qr', async (qr) => {
    try {
        qrCode.generate(qr, { small: true });
    } catch (error) {
        console.error(error);
    }
});


client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', () => {
    console.log('Client is authenticated!');
});

module.exports = client
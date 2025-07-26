const { Client, LocalAuth } = require('whatsapp-web.js');
var qrCode = require('qrcode-terminal');
const {bot} = require('../telegraf/telegraf.js');
const telegrafQr = require('qrcode');
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({ clientId: "my-whatsapp-session" })
});

client.on('qr', async (qr) => {
    try {
        bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, 'QR Code received, scan Now...');
        const qrCodeImage = await telegrafQr.toBuffer(qr);
        bot.telegram.sendPhoto(process.env.TELEGRAM_CHAT_ID, { source: qrCodeImage });
        qrCode.generate(qr, { small: true });
    } catch (error) {
        console.error(error);
    }
});


client.on('ready', () => {
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, 'wwebjs-Client is ready!!');
    console.log('Client is ready!');
});

client.on('authenticated', () => {
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, 'wwebjs-Client is authenticated!!');
    console.log('Client is authenticated!');
});

module.exports = client
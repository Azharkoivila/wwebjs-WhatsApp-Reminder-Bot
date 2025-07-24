const { Telegraf }=require( 'telegraf')
// const { message } = require('telegraf/filters')
// const qr = require('qrcode');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// bot.start(async(ctx) => {
//     try {
//     const qrCodeImage = await qr.toBuffer("hello world");
//     await ctx.replyWithPhoto({ source: qrCodeImage });
//   } catch (error) {
//     console.error(error);
//     ctx.reply('Failed to generate QR code.');
//   }
// })

// bot.on(message('text'), async(ctx) => {
//     try {
//     // const qrCodeImage = await qr.toBuffer(ctx.message.text);
//     // await ctx.replyWithPhoto({ source: qrCodeImage });
//     const chatId = ctx.chat.id;
//   const username = ctx.from.username;
//     console.log(chatId, username);
//   } catch (error) {
//     console.error(error);
//     ctx.reply('Failed to generate QR code.');
//   }
// })

module.exports = bot;

// Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))

// process.on('SIGINT', () => {
//   console.log('Stopping bot gracefully...');
//   bot.stop('SIGINT');
// });
// process.on('SIGTERM', () => {
//   console.log('Stopping bot gracefully...');
//   bot.stop('SIGTERM');
// });
const { Telegraf } = require('telegraf');
const { getSystemInfo } = require('./helper/tHelper.js');
const { exec } = require('child_process');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.TELEGRAM_CHAT_ID;

bot.command('sysInfo', async (ctx) => {
    if (chatId != ctx.chat.id) {
        ctx.reply('You are not authorized to use this command.');
        return;
    }
    ctx.reply('Fetching system information...');
    try {
        const systemInfo = await getSystemInfo();
        ctx.reply(JSON.stringify(systemInfo, null, 2));
    } catch (error) {
        console.error('Error fetching system information:', error);
        ctx.reply('Failed to fetch system information.');
    }

});

bot.command('pm2Status', async (ctx) => {
    console.log(ctx.chat.id);
    if (chatId != ctx.chat.id) {
        ctx.reply('You are not authorized to use this command.');
        return;
    }
    const { exec } = require('child_process');

    exec('pm2 jlist', (err, stdout, stderr) => {
        if (err) {
            console.error('Error fetching PM2 status:', err);
            ctx.reply('Failed to fetch PM2 status.');
            return;
        }
        ctx.reply(`PM2 Status:\n${stdout}`);
    });

})

bot.command('ls', async (ctx) => {
    if (process.env.TELEGRAM_CHAT_ID != ctx.chat.id) {
        ctx.reply('You are not authorized to use this command.');
        return;
    }
    exec('find . -mindepth 1 -maxdepth 1', (err, stdout, stderr) => {
        if (err) {
            console.error('Error listing Directory:', err);
            ctx.reply('Failed to list Directory.');
            return;
        }
        ctx.reply(`Directory contents:\n${stdout}`);
    });
});

function registerWaClintHandlers(client) {
    bot.command('deleteCache', async (ctx) => {
        if (chatId != ctx.chat.id) {
            ctx.reply('You are not authorized to use this command.');
            return;
        }
        try {
            await client.logout();
            const { exec } = require('child_process');
            exec('rm -rf .wwebjs_auth/ .wwebjs_cache/', (err, stdout, stderr) => {
                if (err) {
                    return;
                }
                ctx.reply('Cache deleted successfully.');
            });
        } catch (error) {
            console.error(error);
            return;
        } finally {
            client.initialize();
        }
    });

}


async function startTelegramBot() {
    try {
        bot.launch();
        console.log("✅ Telegram bot launched.");

    } catch (error) {
        console.error("❌ Error launching Telegram bot:", error);
    }
}


module.exports = {
    bot,
    registerWaClintHandlers,
    startTelegramBot
};

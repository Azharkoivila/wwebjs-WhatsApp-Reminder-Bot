const { Telegraf } = require('telegraf');
const { getSystemInfo } = require('./helper/tHelper.js');
const { exec } = require('child_process');
const{addUser,getUsers,removeUser} = require('../bot/users.js');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.TELEGRAM_CHAT_ID;

bot.command('sysinfo', async (ctx) => {
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

bot.command('adduser', async (ctx) => {
    if (chatId != ctx.chat.id) {
        ctx.reply('You are not authorized to use this command.');
        return;
    }
  const userId = `${ctx.message.text.split(' ').slice(1).join(' ').trim()}@c.us`;
  if (!userId || userId.length === 0) {
    ctx.reply('You need to provide a user ID to add.');
  } else {
    ctx.reply(`You said: ${userId}`);
    addUser(userId);
    ctx.reply(`User ${userId} added successfully.`);
  }
});

bot.command('showusers', async (ctx) => {
    if (chatId != ctx.chat.id) {
        ctx.reply('You are not authorized to use this command.');
        return;
    }
    const users = getUsers();
    if (users.length === 0) {
        ctx.reply('No users found.');
    } else {
        ctx.reply(`Registered users:\n${users.join('\n')}`);
    }
});

bot.command('removeuser', async (ctx) => {
    if (chatId != ctx.chat.id) {
        ctx.reply('You are not authorized to use this command.');
        return;
    }
    const userId = `${ctx.message.text.split(' ').slice(1).join(' ').trim()}@c.us`;
    if (!userId || userId.length === 0) {
        ctx.reply('You need to provide a user ID to remove.');
    } else {
        removeUser(userId);
        ctx.reply(`User ${userId} removed successfully.`);
    }
});

 

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

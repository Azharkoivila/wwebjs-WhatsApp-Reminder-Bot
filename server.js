require('dotenv').config();
const { client } = require('./bot/handler.js');
const { startAgenda,graceful } = require('./agenda/agenda.js');
const defineAgenda = require('./agenda/agenda-define.js');
const cleanupAgendaDb = require('./helpers/util/agendaDbCleanup.js');
const { bot,startTelegramBot, registerWaClintHandlers } = require('./telegraf/telegraf.js');
(async () => {
    startTelegramBot();
    try {
        await startAgenda();
        await defineAgenda();
        await cleanupAgendaDb();
        await client.initialize();
        registerWaClintHandlers(client);
    } catch (error) {
        console.error("❌ Error during startup:", error);
        process.exit(1);
    }
})();

process.on('SIGINT', () => {
    console.log("SIGINT received. Stopping Telegram bot...");
    bot.stop('SIGINT');
    graceful();
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log("SIGTERM received. Stopping Telegram bot...");
    bot.stop('SIGTERM');
    graceful();
    process.exit(0);
});
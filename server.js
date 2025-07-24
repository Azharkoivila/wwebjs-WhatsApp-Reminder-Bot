require('dotenv').config()
const { startAgenda } = require('./agenda/agenda.js');
const { client } = require('./bot/handler.js');
const defineAgenda = require('./agenda/agenda-define.js');
const cleanupAgendaDb = require('./helpers/util/agendaDbCleanup.js');
const telegraf = require('./telegraf/telegraf.js');

(async () => {
    try {
        
        await startAgenda();
        await defineAgenda();
        await client.initialize();
        await telegraf.launch();
        await cleanupAgendaDb();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

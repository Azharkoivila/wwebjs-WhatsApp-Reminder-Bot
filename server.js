require('dotenv').config()
const { startAgenda } = require('./agenda/agenda.js');
const { client } = require('./bot/handler.js');
const defineAgenda = require('./agenda/agenda-define.js');
const cleanupAgendaDb = require('./helpers/util/agendaDbCleanup.js');

(async () => {
    try {
        await startAgenda();
        await defineAgenda();
        await client.initialize();
        await cleanupAgendaDb();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

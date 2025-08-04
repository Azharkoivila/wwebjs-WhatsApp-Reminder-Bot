require('dotenv').config();
const { client } = require('./bot/handler.js');
const { startAgenda } = require('./agenda/agenda.js');
const defineAgenda = require('./agenda/agenda-define.js');
const cleanupAgendaDb = require('./helpers/util/agendaDbCleanup.js');
(async () => {
    try {
        await startAgenda();
        await defineAgenda();
        await cleanupAgendaDb();
        await client.initialize();
    } catch (error) {
        console.error("❌ Error during startup:", error);
        process.exit(1);
    }
})();
require('dotenv').config()
const { startAgenda } = require('./agenda/agenda.js');
const { client } = require('./bot/handler.js');
const defineAgenda = require('./agenda/agenda-define.js');

(async () => {
    try {
        await startAgenda();
        console.log('Agenda started successfully.');
        await defineAgenda()
        await client.initialize();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

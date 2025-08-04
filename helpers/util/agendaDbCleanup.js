const { agenda } = require('../../agenda/agenda.js');
async function cleanupAgendaDb() {
    try {
        await agenda.start();
        await agenda._ready;
        await agenda.every('0 3 * * 0', process.env.CLEAN_UP_AGENDA);
    } catch (error) {
        console.error("❌ Error scheduling cleanup job:", error);
    }

}
module.exports = cleanupAgendaDb;
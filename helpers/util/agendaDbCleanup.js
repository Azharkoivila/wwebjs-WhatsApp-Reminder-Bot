const { agenda } = require('../../agenda/agenda.js');
async function cleanupAgendaDb() {
    try {
        await agenda.every('0 3 * * 0', 'cleanup completed jobs');

    } catch (error) {

    }
}
module.exports = cleanupAgendaDb;
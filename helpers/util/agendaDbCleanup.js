const { agenda } = require('../../agenda/agenda.js');
async function cleanupAgendaDb() {
    try {
        await agenda.start();
        await agenda._ready;
        await agenda.every('0 3 * * 0', 'cleanup completed jobs');
        console.log("🧹 Scheduled cleanup job for completed jobs every Sunday at 3 AM.");
    } catch (error) {
        console.error("❌ Error scheduling cleanup job:", error);
    }

}
module.exports = cleanupAgendaDb;
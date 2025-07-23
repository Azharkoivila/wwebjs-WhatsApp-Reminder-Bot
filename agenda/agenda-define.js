const { agenda } = require('./agenda.js');
const { sendReminderMessage } = require('../bot/handler.js');

async function defineAgenda() {

    agenda.define("Reminders", async (job) => {
        try {
            await sendReminderMessage(job);
        } catch (error) {
            console.error('Error sending reminder message:', error);
        }
    });
    agenda.define('cleanup completed jobs', async (job) => {
        try {
            const result = await agenda._collection.deleteMany({
                lastFinishedAt: { $exists: true },
                failedAt: { $exists: false }
            });
            console.log(`🧹 Cleanup complete. Removed ${result.deletedCount} finished jobs.`);

        } catch (error) {
            console.error('Error cleaning up completed jobs:', error);
        }

    });
}

module.exports = defineAgenda;
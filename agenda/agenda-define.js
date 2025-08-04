const { agenda } = require('./agenda.js');
const { sendReminderMessage } = require('../bot/handler.js');

async function defineAgenda() {

    agenda.define(process.env.REMINDER_AGENDA, async (job) => {
        try {
            await sendReminderMessage(job);
        } catch (error) {
            console.error('Error sending reminder message:', error);
        }
    });
    agenda.define(process.env.CLEAN_UP_AGENDA, async (job) => {
        try {
            const result = await agenda._collection.deleteMany({
                lastFinishedAt: { $exists: true },
                repeatInterval: { $exists: false },
                failedAt: { $exists: false },
                nextRunAt: null
            });
            console.log(`🧹 Cleanup complete. Removed ${result.deletedCount} finished jobs.`);

        } catch (error) {
            console.error('Error cleaning up completed jobs:', error);
        }
    });
}

module.exports = defineAgenda;
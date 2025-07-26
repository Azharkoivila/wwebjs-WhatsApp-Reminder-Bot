const { agenda } = require('../../agenda/agenda.js');
const croneParser = require('../util/croneParser.js');
async function scheduleRepeatCron(schedule, user) {
    const { cron, message } = await croneParser(schedule);
    if (!cron || !message) {
        console.error("Invalid schedule format");
        return `❌ Invalid schedule format. Please use a valid reminder format. Example: "Remind me every Monday at 10:00 to call mom"`;

    }
    try {
        await agenda.start();
        await agenda._ready;
        const job = await agenda.every(cron, "Reminders", {
            message, user
        });
          const formattedTime = job.attrs.nextRunAt.toLocaleString('en-IN', {
                timeZone: 'Asia/Calcutta',
                dateStyle: 'medium',
                timeStyle: 'short',
            });

            const confirmationMsg =
                `✅ *New Repeating Reminder Scheduled!*

                📝 *Reminder:* ${job.attrs.data.message}
                ⏰ *When:* ${formattedTime}
                📍 *Status:* Scheduled ⏳`;
        return confirmationMsg;
    } catch (error) {
        console.error("Error scheduling repeating reminder:", error);
    }

}

module.exports = scheduleRepeatCron;
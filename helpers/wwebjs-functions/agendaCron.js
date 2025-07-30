const { agenda } = require('../../agenda/agenda.js');
const croneParser = require('../util/croneParser.js');
const {ObjectId} = require('mongodb')
const {msgRepeatText,reminderFormat} = require('../templates/msgtemplates.js');
async function scheduleRepeatCron(schedule, user) {
    const { cron, message } = await croneParser(schedule);
    if (!cron || !message) {
        console.error("Invalid schedule format");
        return reminderFormat;

    }
    try {
        await agenda.start();
        await agenda._ready;
        const job = agenda.create("Reminders", {
            message, user
        });
        job.repeatEvery(cron);
         await job.save();
          const formattedTime = job.attrs.nextRunAt.toLocaleString('en-IN', {
                timeZone: 'Asia/Calcutta',
                dateStyle: 'medium',
                timeStyle: 'short',
            });

            // const confirmationMsg =
            //     `✅ *New Repeating Reminder Scheduled!*

            //     📝 *Reminder:* ${job.attrs.data.message}
            //     ⏰ *When:* ${formattedTime}
            //     📍 *Status:* Scheduled ⏳`;

        return msgRepeatText(message, formattedTime);
    } catch (error) {
        console.error("Error scheduling repeating reminder:", error);
    }

}

module.exports = scheduleRepeatCron;
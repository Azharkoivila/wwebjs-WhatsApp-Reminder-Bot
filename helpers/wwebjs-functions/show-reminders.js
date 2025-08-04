const { agenda } = require('../../agenda/agenda.js');
const { showReminderText, timestamp, noactiveReminders } = require('../templates/msgtemplates.js');

async function showReminders(msg) {
    const jobs = (await agenda.jobs({ nextRunAt: { $gt: new Date() }, 'data.user': msg.id.remote })).sort((a, b) => a.attrs.nextRunAt - b.attrs.nextRunAt);
    if (jobs.length === 0) {
        msg.reply(noactiveReminders);
    } else {
        let listRemindersView = '📋 *Your Scheduled Reminders:*\n\n';
        jobs.forEach((job, index) => {
            const runAt = job.attrs.nextRunAt;

            // Format date and time in IST
            const dateTime = runAt.toLocaleString('en-IN', timestamp);

            const [dateOnly, timeOnly] = dateTime.split(', ');

            listRemindersView += showReminderText(index, job.attrs.data.message, dateOnly, timeOnly, isRepeat = job.attrs.repeatInterval ? 'Repeating' : 'One-time');
        });


        msg.reply(listRemindersView);


    }
}

module.exports = showReminders;
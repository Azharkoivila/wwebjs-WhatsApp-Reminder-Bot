const { agenda } = require('../../agenda/agenda.js');
const {showReminderText} = require('../templates/msgtemplates.js');

async function showReminders(msg) {
    const jobs = (await agenda.jobs({ nextRunAt: { $gt: new Date() }, 'data.user': msg.id.remote })).sort((a, b) => a.attrs.nextRunAt - b.attrs.nextRunAt);
    if (jobs.length === 0) {
        msg.reply('📭 No active reminders.');
    } else {
        let response = '📋 *Your Scheduled Reminders:*\n\n';
        jobs.forEach((job, index) => {
            const runAt = job.attrs.nextRunAt;

            // Format date and time in IST
            const dateTime = runAt.toLocaleString('en-IN', {
                timeZone: 'Asia/Calcutta',
                dateStyle: 'medium',
                timeStyle: 'short',
            });

            const [dateOnly, timeOnly] = dateTime.split(', '); // Separate date and time

            response += showReminderText(index, job.attrs.data.message, dateOnly, timeOnly, isRepeat = job.attrs.repeatInterval ? 'Repeating' : 'One-time');

            // response += `🔹 *Reminder #${index + 1}*\n` +
            //     `📝 *Message:* ${job.attrs.data.message}\n` +
            //     `📅 *Date:* ${dateOnly}\n` +
            //     `⏰ *Time:* ${timeOnly}\n` +
            //     `🔔 *Alert:* At the time of event\n` +
            //     `📌 *Note:* ${job.attrs.data.message}\n` +
            //     `📍 *Status:* Scheduled ⏳\n\n`;
        });


        msg.reply(response);


    }
}

module.exports = showReminders;
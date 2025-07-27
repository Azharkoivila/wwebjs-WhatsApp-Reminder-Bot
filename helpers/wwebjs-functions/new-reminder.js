const { agenda } = require('../../agenda/agenda.js');
const extractReminder = require('../util/reminer-parser.js');
const chrono = require('chrono-node');
const {msgScheduledText,msgInvalidInput,msgvalidfutureDate} = require('../templates/msgtemplates.js');

async function newReminder(msg, text) {

    const reminder = await extractReminder(text);
    if (reminder.date === undefined || reminder.message === undefined) {
        msg.reply(msgInvalidInput);
    } else {
        // Check if the reminder already exists
        // const existingJob = await agenda.findOne({
        //     'data.message': reminder.message,
        //     'data.user': msg.id.remote,
        // });
        // if (existingJob) {
        //     msg.reply('A reminder with that message already exists. Please delete it first before creating a new one.');
        //     return;
        // }
        // console.log(reminder.date, reminder.message, msg.id.remote);
        let DateTime = chrono.parseDate(reminder.date, new Date(), { forwardDate: true });
        if (DateTime <= new Date()) {
            msg.reply(msgvalidfutureDate);
        } else {
            let result = await NewReminder(reminder.date, reminder.message, msg.id.remote);

            // Format next run time in IST with better formatting
            const formattedTime = result.attrs.nextRunAt.toLocaleString('en-IN', {
                timeZone: 'Asia/Calcutta',
                dateStyle: 'medium',
                timeStyle: 'short',
            });

            // const confirmationMsg =
            //     `✅ *New Reminder Scheduled!*

            //     📝 *Reminder:* ${result.attrs.data.message}
            //     ⏰ *When:* ${formattedTime}
            //     📍 *Status:* Scheduled ⏳`;
            msg.reply(msgScheduledText(formattedTime, result.attrs.data.message));

        }
    }
}

async function NewReminder(time, message, user) {
    try {
        await agenda.start();
        await agenda._ready;
        const job = await agenda.schedule(time, 'Reminders', { message, user });
        // console.log(`New reminder scheduled: ${job.attrs.name} at ${job.attrs.nextRunAt}`);
        return job;
    } catch (error) {
        console.error('Failed to schedule new reminder:', error.message);
    }
}



module.exports = newReminder;
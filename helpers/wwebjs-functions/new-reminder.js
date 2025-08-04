const { agenda } = require('../../agenda/agenda.js');
const extractReminder = require('../util/reminer-parser.js');
const chrono = require('chrono-node');
const { msgScheduledText, msgInvalidInput, msgvalidfutureDate, timestamp } = require('../templates/msgtemplates.js');

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
            let result = await createReminder(reminder.date, reminder.message, msg.id.remote);
            const formattedTime = result.attrs.nextRunAt.toLocaleString('en-IN', timestamp);
            msg.reply(msgScheduledText(formattedTime, result.attrs.data.message));

        }
    }
}


//creation of new Reminder
async function createReminder(time, message, user) {
    try {
        await agenda.start();
        await agenda._ready;
        const job = await agenda.schedule(time, process.env.REMINDER_AGENDA, { message, user });
        return job;
    } catch (error) {
        console.error('Failed to schedule new reminder:', error.message);
    }
}



module.exports = newReminder;
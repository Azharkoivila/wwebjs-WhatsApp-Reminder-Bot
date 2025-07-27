const client = require('../bot/wwebjs');
const { PassThrough } = require('stream');
const cancelReminder = require('../helpers/wwebjs-functions/cancel-reminder.js');
const newReminder = require('../helpers/wwebjs-functions/new-reminder.js');
const showReminders = require('../helpers/wwebjs-functions/show-reminders.js');
const scheduleRepeatCron = require('../helpers/wwebjs-functions/agendaCron.js');
const Transcriptior = require('../helpers/util/assemblyAi.js');
const { instructionMessage,msgNotauthenticated,otherMsg,msgUpdate,reminderText} = require('../helpers/templates/msgtemplates.js');
const {getUsers} = require('./users.js');


client.on('message', async msg => {
    const msgBody = msg.body.toLowerCase();

    // ping
    if (msgBody == '!ping') {
        console.log(msg.id.remote)
        msg.reply('pong');
        return;
    }

    // help/instructions
    if (msgBody === 'help' || msgBody === 'hai' || msgBody === 'hi' || msgBody === 'hello' || msgBody === 'start') {
        const chat=await msg.getChat();
        chat.sendStateTyping();
          setTimeout(async () => {
            await msg.reply(instructionMessage);
            await chat.clearState();
        }, 1000);
        return;
    }

    // cancel
    if (msgBody.startsWith('cancel') || msgBody.startsWith('delete')) {
        if (!getUsers().includes(msg.id.remote)) {
            msg.reply(msgNotauthenticated);
            return;
        }
        try {
            await cancelReminder(msg);
        } catch (error) {
            console.error("Failed to cancel Reminder:", error);
        }
        return;
    }
    //create  reminder
    if (msgBody.includes('remind me')) {
        if (!getUsers().includes(msg.id.remote)) {
            msg.reply(msgNotauthenticated);
            return;
        }
        if(msgBody.includes('every')) {
            try {
                const result = await scheduleRepeatCron(msgBody, msg.id.remote);
                msg.reply(result);
            } catch (error) {
                console.error("Failed to schedule repeating reminder:", error);
            }
            return;
        }
        try {

            await newReminder(msg, msgBody);
        } catch (error) {
            console.error('Failed to add New Reminder', error);
        }
        return;
    }
    //update reminder
    if (msgBody.startsWith('update') || msgBody.startsWith('edit')) {
        if (!getUsers().includes(msg.id.remote)) {
            msg.reply(msgNotauthenticated);
            return;
        }
        msg.reply(msgUpdate);
        return;
    }
    //show reminders
    if (msgBody.startsWith('show') || msgBody.startsWith('list')) {
        if (!getUsers().includes(msg.id.remote)) {
            msg.reply(msgNotauthenticated);
            return;
        }
        try {

            await showReminders(msg);
        } catch (error) {
            console.error('Failed to Show Reminder', error);
        }
        return;
    }
    //transcribe voice message
    if (msg.hasMedia) {
        if (!getUsers().includes(msg.id.remote)) {
            msg.reply(msgNotauthenticated);
            return;
        }
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const media = await msg.downloadMedia();

        
        if (media.mimetype.startsWith('audio')) {
            try {
                const audioBuffer = await Buffer.from(media.data, 'base64');
                const stream = new PassThrough();
                stream.end(audioBuffer);
                const text = await Transcriptior(stream);
                if (text.includes("every")) {
                    console.log(text);
                    const result = await scheduleRepeatCron(text, msg.id.remote);
                    setTimeout(async () => {
                        await msg.reply(result);
                        await chat.clearState();
                    }, 1000);
                    return;
                }
                setTimeout(async () => {
                    await newReminder(msg, text);
                    await chat.clearState();
                }, 1000);
            } catch (error) {
                console.error('Failed to transcribe audio:', error);
            }
            return;
        }
    }

    // Any other message
    msg.reply(otherMsg);
});


//function to Handle send Reminder on Time
async function sendReminderMessage(job) {
    try {
        const { message, user } = job.attrs.data;

        // Format the execution time in IST
        const timeString = job.attrs.lastRunAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Calcutta',
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        await client.sendMessage(user, reminderText(message, timeString));
    } catch (err) {
        console.error('Failed to send message:', err);
    }


}

module.exports = { client, sendReminderMessage };
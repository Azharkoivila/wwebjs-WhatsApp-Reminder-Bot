const client = require('../bot/wwebjs');
const { PassThrough } = require('stream');
const cancelReminder = require('../helpers/wwebjs-functions/cancel-reminder.js');
const newReminder = require('../helpers/wwebjs-functions/new-reminder.js');
const showReminders = require('../helpers/wwebjs-functions/show-reminders.js');
const scheduleRepeatCron = require('../helpers/wwebjs-functions/agendaCron.js');
const Transcriptior = require('../helpers/util/assemblyAi.js');
const { instructionMessage, msgNotauthenticated, otherMsg, msgUpdate,timestamp, reminderText } = require('../helpers/templates/msgtemplates.js');
const { getUsers } = require('./users.js');
// const {msgBodyParser}=require('../helpers/msgScheduler/helper.js');
// const {ScheduleMsg}=require('../helpers/msgScheduler/createMsgScheduler.js')


const asyncHandler = (fn) => {
    return async (...args) => {
        try {
            await fn(...args);
        } catch (error) {
            console.log(error)
        }
    }
}

const HandleUnauthorized = asyncHandler(async (msg, chat) => {
    await msg.reply(msgNotauthenticated);
    await chat.clearState();
})

client.on('message', asyncHandler(async msg => {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    const msgBody = msg.body.toLowerCase();
    const userId = msg.id.remote

    // ping
    if (msgBody == '!ping') {
        console.log(msg.id.remote);
        await msg.reply('pong');
        await chat.clearState();
        return;
    }

    // help/instructions
    if (['help', 'hai', 'hi', 'hello', 'start'].includes(msgBody)) {
        await msg.reply(instructionMessage);
        await chat.clearState();
        return;
    }

    // cancel
    if (msgBody.startsWith('cancel') || msgBody.startsWith('delete')) {
        console.log("cancel called")
        if (!getUsers().includes(userId)) return HandleUnauthorized(msg, chat);
        await cancelReminder(msg);
        await chat.clearState();
        return;
    }
    //create  reminder
    if (msgBody.includes('remind me')) {
        if (!getUsers().includes(userId)) return HandleUnauthorized(msg, chat);
        if (msgBody.includes('every')) {
            const result = await scheduleRepeatCron(msgBody, msg.id.remote);
            msg.reply(result);
            return;
        }
        await newReminder(msg, msgBody);
        await chat.clearState();
        return;
    }
    //update reminder under dev
    if (msgBody.startsWith('update') || msgBody.startsWith('edit')) {
        if (!getUsers().includes(userId)) return HandleUnauthorized(msg, chat);
        await msg.reply(msgUpdate);
        await chat.clearState();
        return;
    }
    //show reminders
    if (['show', 'list'].includes(msgBody)) {
        if (!getUsers().includes(userId)) return HandleUnauthorized(msg, chat);
        await showReminders(msg);
        await chat.clearState();
        return;

    }
    //dev
    //     if (msgBody.startsWith('schedule') || msgBody.startsWith('msg')) {
    //     if (!getUsers().includes(msg.id.remote)) {
    //         setTimeout(async () => {
    //             await msg.reply(msgNotauthenticated);
    //             await chat.clearState();
    //         }, 1000);
    //         return;
    //     }
    //     try {
    //         setTimeout(async () => {
    //        const result = await ScheduleMsg(msgBodyParser(msg,msgBody));

    //         }, 1000);
    //     } catch (error) {
    //         console.error('Failed to Show Reminder', error);
    //     }
    //     return;
    // }
    //transcribe voice message
    if (msg.hasMedia) {
        if (!getUsers().includes(userId)) return HandleUnauthorized(msg, chat);
        const media = await msg.downloadMedia();
        if (media.mimetype.startsWith('audio')) {
            const audioBuffer = await Buffer.from(media.data, 'base64');
            const stream = new PassThrough();
            stream.end(audioBuffer);
            const text = await Transcriptior(stream);
            if (text.includes("every")) {
                console.log(text);
                const result = await scheduleRepeatCron(text, msg.id.remote);
                await msg.reply(result);
                await chat.clearState();
                return;
            }
            await newReminder(msg, text);
            await chat.clearState();
            return;
        }
    }

    // Any other message
    await msg.reply(otherMsg);
    await chat.clearState();
}));


//function to Handle send Reminder on Time
async function sendReminderMessage(job) {
    try {
        const { message, user } = job.attrs.data;

        // Format the execution time in IST
        const timeString = job.attrs.lastRunAt.toLocaleString('en-IN',timestamp);

        await client.sendMessage(user, reminderText(message, timeString));
    } catch (err) {
        console.error('Failed to send message:', err);
    }


}

async function sendScheduledMsg(job) {
    try {
        const { message, toUser, fromUser } = job.attrs.data;

        // Format the execution time in IST
        const timeString = job.attrs.lastRunAt.toLocaleString('en-IN', timestamp);

        await client.sendMessage(toUser,);
    } catch (err) {
        console.error('Failed to send message:', err);
    }


}

module.exports = { client, sendReminderMessage, sendScheduledMsg };
const client = require('../bot/wwebjs');
const { PassThrough } = require('stream');
const cancelReminder = require('../helpers/wwebjs-functions/cancel-reminder.js');
const newReminder = require('../helpers/wwebjs-functions/new-reminder.js');
const showReminders = require('../helpers/wwebjs-functions/show-reminders.js');
const Transcriptior = require('../helpers/util/assemblyAi.js');



// Instruction message
const instructionMessage =
    `🤖 *WhatsApp Reminder Bot Instructions*
Hello! I'm your WhatsApp Reminder Bot, here to help you manage your reminders easily.
Available Commands:
1. \`!ping\` - Check if the bot is online.
2. \`Remind me on [date] at [time] to [message]\` - Schedule a new reminder.
3. \`Cancel [Reminder name]\` - Cancel an existing reminder.
4. \`Show reminders\` - List all your scheduled reminders.
5. \`Update [Reminder name] on [date] at [time] to [message]\` - Update an existing reminder.(Not available Now. Currently, Working on it)
6. \`Voice Command\` - Send an audio message to transcribe it into text and create a reminder.[Currently, only Reminder Creation is supported]

*Features:*
- Schedule, cancel, and list reminders.
- Transcribe audio messages into reminders.
- All times are in IST (Asia/Calcutta).

*Developer:* Azhar Koivila
*GitHub:* https://github.com/azharkoivila

For more help, please refer to the documentation or contact support.
`;

const allowedUsers = [
    "919746707326@c.us"// Replace with actual WhatsApp numbers of allowed users
]

client.on('message', async msg => {
    const msgBody = msg.body.toLowerCase();

    // ping
    if (msgBody == '!ping') {
        console.log(msg.id.remote)
        msg.reply('pong');
        return;
    }

    // help/instructions
    if (msgBody === '!help' || msgBody === 'help' || msgBody === 'instructions') {
        msg.reply(instructionMessage);
        return;
    }

    // cancel
    if (msgBody.startsWith('cancel') || msgBody.startsWith('delete')) {
        if (!allowedUsers.includes(msg.id.remote)) {
            msg.reply('🚫 You are *unauthenticated* to perform this action.');
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
        if (!allowedUsers.includes(msg.id.remote)) {
            msg.reply('🚫 You are *unauthenticated* to perform this action.');
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
        if (!allowedUsers.includes(msg.id.remote)) {
            msg.reply('🚫 You are *unauthenticated* to perform this action.');
            return;
        }
        msg.reply('Please delete the reminder first and then create a new one with the updated details.');
        return;
    }
    //show reminders
    if (msgBody.startsWith('show') || msgBody.startsWith('list')) {
        if (!allowedUsers.includes(msg.id.remote)) {
            msg.reply('🚫 You are *unauthenticated* to perform this action.');
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
        if (!allowedUsers.includes(msg.id.remote)) {
            msg.reply('🚫 You are *unauthenticated* to perform this action.');
            return;
        }
        const media = await msg.downloadMedia();

        if (media.mimetype.startsWith('audio')) {
            const audioBuffer = Buffer.from(media.data, 'base64');
            const stream = new PassThrough();
            stream.end(audioBuffer);
            try {
                const text = await Transcriptior(stream);
                //console.log('Transcribed Text:', text);
                await newReminder(msg, text);
            } catch (error) {
                console.error('Failed to transcribe audio:', error);
            }
            return;
        }
    }

    // Any other message
    msg.reply('Hi! Send *!help* for instructions on how to use the Reminder Bot.');
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

        const reminderText =
            `🛎️ *Reminder Alert!*

            📝 *Task:* ${message}
            🕒 *Time:* ${timeString}
            🚀 *Action:* Start Now`;

        await client.sendMessage(user, reminderText);
        console.log('Message sent successfully!');
    } catch (err) {
        console.error('Failed to send message:', err);
    }


}

module.exports = { client, sendReminderMessage };
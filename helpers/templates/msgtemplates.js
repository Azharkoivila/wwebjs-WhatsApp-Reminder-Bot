const instructionMessage =
    `🤖 *WhatsApp Reminder Bot Instructions*
Hello! I'm your WhatsApp Reminder Bot, here to help you manage your reminders easily.
Available Commands:
1. \`!ping\` - Check if the bot is online.
2. \`Remind me on [date] at [time] to [message]\` - Schedule a new reminder.
3. \`Cancel [Reminder name]\` - Cancel an existing reminder.
4. \`Show reminders\` - List all your scheduled reminders.
5. \`Update [Reminder name] on [date] at [time] to [message]\` - Update an existing reminder.(Not available Now. Currently, Working on it)
6. \`Voice Command\` - Send an audio message to transcribe it into text and create a reminder.[Currently, only Reminder Creation is supported] Note:The audio should be in English and use AssemblyAI for transcription. may not work properly.
Technical Stack Used:
- Refer https://github.com/Azharkoivila/wwebjs-WhatsApp-Reminder-Bot.
*Features:*
- Schedule, cancel, and list reminders.
- Transcribe audio messages into reminders.
- All times are in IST (Asia/Calcutta).

*Developer:* Azhar Koivila
*folio:* https://azharkoivila.tedomum.org/

For more help, please refer to the documentation or contact support.
`;


const timestamp={
            timeZone: 'Asia/Calcutta',
            dateStyle: 'medium',
            timeStyle: 'short',
        }
const msgNotauthenticated = `🚫 You are *unauthenticated* to perform this action. contact Developer.`;

const otherMsg = 'Hi! Send *help* for instructions on how to use the Reminder Bot.';

const msgUpdate = `🚫 Currently Update Not Supported. You need to delete the reminder first and then create a new one with the updated details.`;

const reminderFormat = `❌ Invalid schedule format. Please use a valid reminder format. Example: "Remind me every Monday at 10:00 to call mom"`;

const msgDelete = `✅ Reminder deleted successfully.`;

const msgDeletefailed = `❌ Failed to delete the reminder. Please try again later.`;

const msgNoreminderfound= `❌ No reminder found with that name. Please check the name and try again. for Delete a reminder, use the format: "Cancel [Reminder name] (Must be the same as the reminder name you provided when creating it)"`;

const msgvalidReminderName = `❌ Please provide a valid reminder name.`;

const msgInvalidInput = `❗ Invalid input format. Please use "Remind me on [date] at [time] to [message]"`;

const msgvalidfutureDate = `❗Please provide a future date and Time\n.OR Provide AM/PM format for the time. e.g: Remind me on [date] at [time] to [message] `;

const noactiveReminders='📭 No active reminders.';

 let listRemindersView = '📋 *Your Scheduled Reminders:*\n\n';


function reminderText(message, timeString) {
   return `🛎️ *Reminder Alert!*
            📝 *Task:* ${message}
            🕒 *Time:* ${timeString}
            🚀 *Action:* Start Now`;

}
function msgRepeatText(message, timeString) {
    return `🛎️ *Repeating Reminder Scheduled!*
            📝 *Task:* ${message}
            🕒 *Time:* ${timeString}
            📍 *Status:* Scheduled ⏳`;
}

function msgScheduledText(formattedTime, reminder) {
    return  `✅ *New Reminder Scheduled!*

                📝 *Reminder:* ${reminder}
                ⏰ *When:* ${formattedTime}
                📍 *Status:* Scheduled ⏳`;
}

function showReminderText(index,reminder, dateOnly, timeOnly, type) {
    return `🔹 *Reminder #${index + 1}*\n` +
                `📝 *Message:* ${reminder}\n` +
                `📅 *Date:* ${dateOnly}\n` +
                `⏰ *Time:* ${timeOnly}\n` +
                `🔔 *Alert:* At the time of event\n` +
                `📌 *Type:* ${type}\n` +
                `📍 *Status:* Scheduled ⏳\n\n`;
}

module.exports = {
    instructionMessage,
    msgNotauthenticated,
    otherMsg,
    msgUpdate,
    reminderFormat,
    msgDelete,
    msgDeletefailed,
    msgNoreminderfound,
    msgvalidReminderName,
    msgInvalidInput,
    msgvalidfutureDate,
    timestamp,
    noactiveReminders,
    listRemindersView,
    reminderText,
    msgRepeatText,
    msgScheduledText,
    showReminderText
};
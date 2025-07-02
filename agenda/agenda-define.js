const {agenda}=require('./agenda.js');
const {sendReminderMessage} = require('../bot/handler.js');

async function defineAgenda() {

    agenda.define("Reminders", async (job) => {
        try {
            await sendReminderMessage(job);
        } catch (error) {
            console.error('Error sending reminder message:', error);
        }
    });
}

module.exports = defineAgenda;
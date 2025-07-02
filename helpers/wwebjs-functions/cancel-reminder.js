const getFileName = require('../util/regx-functions.js');
const { agenda } = require('../../agenda/agenda.js');

async function CancelReminder(msg) {

    const fileName = await getFileName(msg.body.toLowerCase());
    if (!fileName) {
        msg.reply('Please provide a valid file name to cancel.');
        return;
    }
    try {
        let result = await agenda.jobs({ ['data.message']: fileName, ['data.user']: msg.id.remote });
        if (result.length === 0) {
            msg.reply('No reminder found with that name.');
            return;
        }
        // Cancel the reminder job
        await agenda.cancel({ ['data.message']: fileName, ['data.user']: msg.id.remote });
        msg.reply('Reminder Deleted successfully. ✅');
    } catch (error) {
        msg.reply('Error deleting reminder. Please try again later.❌');
        console.error('Error deleting reminder:', error);
    }
}

module.exports = CancelReminder;
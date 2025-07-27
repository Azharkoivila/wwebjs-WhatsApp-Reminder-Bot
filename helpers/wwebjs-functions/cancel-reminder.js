const getFileName = require('../util/regx-functions.js');
const { agenda } = require('../../agenda/agenda.js');
const{msgDelete,msgDeletefailed,msgNoreminderfound,msgvalidReminderName} = require('../templates/msgtemplates.js');
async function CancelReminder(msg) {

    const fileName = await getFileName(msg.body.toLowerCase());
    if (!fileName) {
        msg.reply(msgvalidReminderName);
        return;
    }
    try {
        let result = await agenda.jobs({ ['data.message']: fileName, ['data.user']: msg.id.remote });
        if (result.length === 0) {
            msg.reply(msgNoreminderfound);
            return;
        }
        // Cancel the reminder job
        await agenda.cancel({ ['data.message']: fileName, ['data.user']: msg.id.remote });
        msg.reply(msgDelete);
    } catch (error) {
        msg.reply(msgDeletefailed);
        console.error('Error deleting reminder:', error);
    }
}

module.exports = CancelReminder;
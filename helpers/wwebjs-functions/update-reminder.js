/* 


Under DEvelopment


*/

const fileName = getFileName(msgBody);
if (!fileName) {
    msg.reply('Please provide a valid file name to update.');
    return;
}
const reminder = await extractReminder(msgBody);
if (reminder.date === undefined || reminder.message === undefined) {
    msg.reply('Invalid input format. Please use "Update [file name] on [date] at [time] to [message]"');
} else {
    try {
        const job = await agenda.findOne({ 'data.message': fileName, 'data.user': msg.id.remote });
        if (!job) {
            msg.reply('No reminder found with that name.');
            return;
        }
        job.attrs.data.message = reminder.message;
        job.attrs.nextRunAt = new Date(reminder.date);
        await job.save();
        msg.reply(`✅ Reminder updated:\n
           📝 Reminder: ${job.attrs.data.message}\n
           ⏰ At: ${job.attrs.nextRunAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Calcutta',
        })}\n
           ℹ️ Status: Scheduled ⏳`);
    } catch (error) {
        console.error('Error updating reminder:', error);
        msg.reply('Error updating reminder. Please try again later.');
    }
}
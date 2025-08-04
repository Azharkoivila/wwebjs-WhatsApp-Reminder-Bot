
async function ScheduleMsg(time, message, toUser,fromUser) {
    try {
        await agenda.start();
        await agenda._ready;
        const job = await agenda.schedule(time, process.env.SCHEDULE_MSG_AGENDA, { message, toUser,fromUser });
        // console.log(`New reminder scheduled: ${job.attrs.name} at ${job.attrs.nextRunAt}`);
        return job;
    } catch (error) {
        console.error('Failed to schedule new reminder:', error.message);
    }
}

module.exports={ScheduleMsg}
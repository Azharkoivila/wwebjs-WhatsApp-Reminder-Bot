const { Agenda } = require('agenda');

const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } });

async function startAgenda() {
  try {
    await agenda.start();
    console.log('Agenda started successfully.');
    await agenda._ready;
    console.log('Agenda is ready to run jobs.');
    const jobs = await agenda.jobs({});
    console.log(`Agenda is connected to MongoDB. Found ${jobs.length} job(s).`);
  } catch (err) {
    console.error('Agenda failed to connect to MongoDB or run jobs:', err.message);
  }
};


module.exports = {agenda, startAgenda};
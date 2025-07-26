const { Agenda } = require('agenda');
const {bot} = require('../telegraf/telegraf.js')

const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } });

async function startAgenda() {
  try {
    await agenda.start();
    console.log('Agenda started successfully.');
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, 'Agenda started successfully.');
    await agenda._ready;
    console.log('Agenda is ready to run jobs.');
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, 'Agenda is ready to run jobs.');
    const jobs = await agenda.jobs({});
    console.log(`Agenda is connected to MongoDB. Found ${jobs.length} job(s).`);
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, `Agenda is connected to MongoDB. Found ${jobs.length} job(s).`);
  } catch (err) {
    console.error('Agenda failed to connect to MongoDB or run jobs:', err.message);
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, `Agenda failed to connect to MongoDB or run jobs: ${err.message}`);
    throw err;
  }
};

async function graceful() {
  console.log('Gracefully stopping Agenda...');
	await agenda.stop();
}
module.exports = {agenda, startAgenda, graceful};
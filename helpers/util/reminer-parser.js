const chrono = require('chrono-node');
const { DateTime } = require('luxon');

async function extractReminder(text, referenceDate = new Date()) {
    const parser = chrono.en.GB;
    const parsedResults = parser.parse(text, referenceDate, { forwardDate: true });

    if (parsedResults.length === 0) {
        return { error: 'No date/time found in input.' };
    }

    const datetime = parsedResults[0].start.date();
    const datetimeText = parsedResults[0].text;

    const istDate = DateTime.fromJSDate(datetime).setZone('Asia/Kolkata');

    let reminderMessage = text
        .replace(new RegExp(datetimeText, 'i'), '')
        .replace(/remind me( to| at| on)?/i, '')
        .replace(/\s+/g, ' ')
        .trim();

    return {
        date: istDate.toISO(),
        message: reminderMessage
    };
}


module.exports = extractReminder;


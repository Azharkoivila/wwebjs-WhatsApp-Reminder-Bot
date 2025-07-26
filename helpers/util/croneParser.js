const chrono = require("chrono-node");

const dayMap = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6
};

function parseScheduleToCron(input) {
  const lower = input.toLowerCase();
  const date = chrono.parseDate(input);
  const hours = date ? date.getHours() : 0;
  const minutes = date ? date.getMinutes() : 0;

  let cron = null;

  if (/every weekday/.test(lower)) cron = `${minutes} ${hours} * * 1-5`;
  else if (/every weekend/.test(lower)) cron = `${minutes} ${hours} * * 6,0`;
  else {
    let match = lower.match(/every (\d+)\s*minutes?/);
    if (match) cron = `*/${match[1]} * * * *`;

    match = lower.match(/every (\d+)\s*hours?/);
    if (!cron && match) cron = `0 */${match[1]} * * *`;

    if (!cron && (/every day/.test(lower) || /daily/.test(lower))) cron = `${minutes} ${hours} * * *`;

    match = lower.match(/every ((?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:,?\s*(?:and)?\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))*)/);
    if (!cron && match) {
      const days = match[1]
        .split(/,|and/)
        .map(d => d.trim())
        .filter(Boolean)
        .map(d => dayMap[d.toLowerCase()])
        .join(',');
      cron = `${minutes} ${hours} * * ${days}`;
    }

    if (!cron) {
      for (const day in dayMap) {
        if (lower.includes(`every ${day}`)) {
          cron = `${minutes} ${hours} * * ${dayMap[day]}`;
          break;
        }
      }
    }

    match = lower.match(/every (january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/);
    if (!cron && match) {
      const month = new Date(`${match[1]} 1, 2000`).getMonth() + 1;
      const day = parseInt(match[2]);
      cron = `${minutes} ${hours} ${day} ${month} *`;
    }

    match = lower.match(/every\s+(\d{1,2})(?:st|nd|rd|th)?\s*(?:and\s+(\d{1,2})(?:st|nd|rd|th)?)?\s+of\s+each\s+month/);
    if (!cron && match) {
      const days = [match[1], match[2]].filter(Boolean).join(',');
      cron = `${minutes} ${hours} ${days} * *`;
    }

    if (!cron && /every (1st|first) of the month/.test(lower)) cron = `${minutes} ${hours} 1 * *`;

    if (!cron && /every last day of the month/.test(lower)) cron = `${minutes} ${hours} L * *`;

    match = lower.match(/every (\d)(?:st|nd|rd|th)? (\w+) at/i);
    if (!cron && match && dayMap[match[2].toLowerCase()] !== undefined) {
      cron = `${minutes} ${hours} * * ${dayMap[match[2].toLowerCase()]}#${match[1]}`;
    }
  }

  // Extract message (e.g., “to call mom”)
  let message = "";
  const messageMatch = input.match(/(?:at\s+\d{1,2}(:\d{2})?)\s+(.*)/i) ||
                       input.match(/(?:every.*)\s+(to|for|about)\s+(.*)/i);

  if (messageMatch) {
    message = messageMatch[2]?.trim() || "";
  }

  if (!cron) return { cron: null, message: "❌ Unable to parse input." };

  return { cron, message };
}

module.exports = parseScheduleToCron;

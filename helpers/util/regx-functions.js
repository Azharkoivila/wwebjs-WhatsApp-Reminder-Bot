async function getFileName(text) {
  const match = text.match(/\b(?:delete|cancel)\s+(.*)/i);
  return match ? match[1] : null;
}

module.exports = getFileName;


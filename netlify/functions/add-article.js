const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }
  try {
    const dataPath = path.join(__dirname, '../../data.json');
    const artikel = JSON.parse(event.body);
    let daten = [];
    if (fs.existsSync(dataPath)) {
      daten = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    daten.push(artikel);
    fs.writeFileSync(dataPath, JSON.stringify(daten, null, 2));
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}; 
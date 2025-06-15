// controllers/nlpController.js

// Import the single extractEntities function
const { extractEntities } = require('../utils/nlpLogic');

exports.parseDescription = (req, res) => {
  try {
    const { description } = req.body;
    // Call into utils to pull out amount, date, vendor, category, type
    const entities = extractEntities(description);
    return res.json(entities);
  } catch (err) {
    console.error('parseDescription error:', err);
    return res.status(500).json({ message: 'NLP parsing failed' });
  }
};

// controllers/categoryController.js
const categories = [
  'salary','tip','project','food','movie',
  'bills','medical','fee','tax'
];
const keywordMap = {
  food: ['groc','restaur','cafe','deli'],
  movie: ['cinema','netflix','amc'],
  bills: ['electric','water','internet','bill'],
  medical: ['pharm','clinic','hospital','doctor'],
  tip: ['tip'],
  salary: ['salary','payroll','wages'],
};

exports.predictCategory = (req, res) => {
  try {
    const desc = (req.body.description || '').toLowerCase();
    for (const [cat, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(k => desc.includes(k))) {
        return res.json({ category: cat });
      }
    }
    // default fallback
    return res.json({ category: 'other' });
  } catch (err) {
    console.error(err);
    return res.json({ category: 'other' });
  }
};

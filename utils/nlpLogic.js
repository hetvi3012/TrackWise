// utils/nlpLogic.js

const nlp    = require('compromise');
const chrono = require('chrono-node');

// Keyword map for category inference
const CATEGORY_KEYWORDS = {
  salary:   ['salary', 'payroll', 'paycheck'],
  tip:      ['tip'],
  project:  ['project', 'freelance', 'contract'],
  food:     ['restaurant','dinner','lunch','food','cafe','grocery','meal','zomato','ubereats'],
  movie:    ['movie','cinema','netflix','theatre'],
  bills:    ['bill','electric','water','internet','rent','subscription'],
  medical:  ['doctor','pharmacy','hospital','clinic','medical'],
  fee:      ['fee','charge','charges'],
  tax:      ['tax']
};
const INCOME_CATS = ['salary','tip','project'];

function extractEntities(text = '') {
  // ─── AMOUNT via regex ─────────────────────────────────
  const moneyRe = /([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2}))/g;
  const tokens  = [];
  let m;
  while ((m = moneyRe.exec(text))) {
    let num = m[1]
      .replace(/\.(?=\d{3})/g, '') // strip thousands-dot
      .replace(',', '.');          // comma→decimal
    const val = parseFloat(num);
    if (!isNaN(val)) tokens.push(val);
  }
  const amount = tokens.length ? Math.max(...tokens) : null;

  // ─── DATE via chrono-node ─────────────────────────────
  let date = null;
  const cd  = chrono.parseDate(text);
  if (cd) date = cd.toISOString().slice(0, 10);

  // ─── VENDOR via compromise ────────────────────────────
  const doc    = nlp(text);
  const orgs   = doc.organizations().out('array');
  const people = doc.people().out('array');
  let vendor   = orgs.concat(people)[0] || null;
  if (!vendor) {
    const nouns = doc.nouns().out('array');
    vendor = nouns[0] || null;
  }
  if (vendor) {
    vendor = vendor.replace(/\d+/g, '').trim();                      // strip digits
    vendor = vendor.replace(/\b(rs|₹|usd|eur)\b/gi, '').trim();      // strip currency abbrev
  }

  // ─── CATEGORY via keywords ────────────────────────────
  let category = 'other';
  const lower  = text.toLowerCase();
  for (const [cat, keys] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keys.some(k => lower.includes(k))) {
      category = cat;
      break;
    }
  }

  // ─── TYPE inference ───────────────────────────────────
  const type = INCOME_CATS.includes(category) ? 'income' : 'expense';

  return { amount, date, vendor, category, type };
}

module.exports = { extractEntities };

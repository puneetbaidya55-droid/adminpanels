const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('../src/database/db');
const { migrate } = require('../src/database/migrate');
db.init().then(() => migrate()).then(() => { console.log('Done'); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });

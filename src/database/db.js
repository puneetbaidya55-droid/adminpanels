const { Pool } = require('pg');
const config = require('../config/config');

let pool;
function getPool() {
  if (pool) return pool;
  if (config.database.url) {
    pool = new Pool({ connectionString: config.database.url, max: 20 });
  } else {
    pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      max: 20,
    });
  }
  return pool;
}

async function query(text, params) {
  const p = getPool();
  const res = await p.query(text, params);
  return res;
}

async function init() {
  const p = getPool();
  await p.query('SELECT 1');
  return p;
}

module.exports = { getPool, query, init };

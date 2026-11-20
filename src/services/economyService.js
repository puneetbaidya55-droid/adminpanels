const db = require('../database/db');

async function ensureUser(userId, guildId) {
  await db.query('INSERT INTO economy (user_id, guild_id) VALUES ($1,$2) ON CONFLICT (user_id, guild_id) DO NOTHING', [userId, guildId]);
}

async function getBalance(userId, guildId) {
  await ensureUser(userId, guildId);
  const r = await db.query('SELECT balance, bank, frozen, daily_streak, last_daily FROM economy WHERE user_id=$1 AND guild_id=$2', [userId, guildId]);
  return r.rows[0];
}

async function addBalance(userId, guildId, amount, type, desc) {
  await ensureUser(userId, guildId);
  const r = await db.query('UPDATE economy SET balance = balance + $1 WHERE user_id=$2 AND guild_id=$3 RETURNING balance', [amount, userId, guildId]);
  const after = r.rows[0].balance;
  await db.query('INSERT INTO transactions (user_id, guild_id, type, amount, balance_after, description) VALUES ($1,$2,$3,$4,$5,$6)', [userId, guildId, type, amount, after, desc]);
  return after;
}

async function transfer(fromId, toId, guildId, amount) {
  await ensureUser(fromId, guildId);
  await ensureUser(toId, guildId);
  const r = await db.query('SELECT balance, frozen FROM economy WHERE user_id=$1 AND guild_id=$2', [fromId, guildId]);
  if (r.rows[0].frozen) throw new Error('Your account is frozen.');
  if (r.rows[0].balance < amount) throw new Error('Insufficient balance.');
  await db.query('BEGIN');
  try {
    await db.query('UPDATE economy SET balance = balance - $1 WHERE user_id=$2 AND guild_id=$3', [amount, fromId, guildId]);
    await db.query('UPDATE economy SET balance = balance + $1 WHERE user_id=$2 AND guild_id=$3', [amount, toId, guildId]);
    await db.query('COMMIT');
  } catch (e) {
    await db.query('ROLLBACK');
    throw e;
  }
  await db.query('INSERT INTO transactions (user_id, guild_id, type, amount, description) VALUES ($1,$2,$3,$4,$5)', [fromId, guildId, 'pay_out', -amount, `Paid ${toId}`]);
  await db.query('INSERT INTO transactions (user_id, guild_id, type, amount, description) VALUES ($1,$2,$3,$4,$5)', [toId, guildId, 'pay_in', amount, `Received from ${fromId}`]);
}

module.exports = { ensureUser, getBalance, addBalance, transfer };

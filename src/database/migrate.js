const db = require('./db');
const fs = require('fs');
const path = require('path');

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  discord_id VARCHAR(32) UNIQUE NOT NULL,
  username VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS guilds (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(128),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS economy (
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  balance BIGINT DEFAULT 0,
  bank BIGINT DEFAULT 0,
  frozen BOOLEAN DEFAULT FALSE,
  daily_streak INT DEFAULT 0,
  last_daily TIMESTAMP,
  last_weekly TIMESTAMP,
  last_monthly TIMESTAMP,
  last_work TIMESTAMP,
  PRIMARY KEY (user_id, guild_id)
);
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  type VARCHAR(32) NOT NULL,
  amount BIGINT NOT NULL,
  balance_after BIGINT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  item VARCHAR(64) NOT NULL,
  quantity INT DEFAULT 1,
  UNIQUE (user_id, guild_id, item)
);
CREATE TABLE IF NOT EXISTS shop_items (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  name VARCHAR(64) NOT NULL,
  price BIGINT NOT NULL,
  description TEXT,
  stock INT DEFAULT -1
);
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  achievement VARCHAR(64) NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, guild_id, achievement)
);
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_id VARCHAR(32) NOT NULL,
  referred_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (referred_id, guild_id)
);
CREATE TABLE IF NOT EXISTS warnings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  moderator_id VARCHAR(32) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS mod_logs (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  action VARCHAR(32) NOT NULL,
  target_id VARCHAR(32),
  moderator_id VARCHAR(32),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  channel_id VARCHAR(32) NOT NULL,
  user_id VARCHAR(32) NOT NULL,
  category VARCHAR(64),
  status VARCHAR(16) DEFAULT 'open',
  priority VARCHAR(16) DEFAULT 'normal',
  claimed_by VARCHAR(32),
  close_reason TEXT,
  rating INT,
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS staff_members (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  rank VARCHAR(32) DEFAULT 'trial',
  status VARCHAR(16) DEFAULT 'active',
  applied_at TIMESTAMP DEFAULT NOW(),
  promoted_at TIMESTAMP,
  UNIQUE (user_id, guild_id)
);
CREATE TABLE IF NOT EXISTS staff_applications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(16) DEFAULT 'pending',
  reviewer_id VARCHAR(32),
  review_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS staff_discipline (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  type VARCHAR(16) NOT NULL,
  reason TEXT NOT NULL,
  moderator_id VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS staff_activity (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  action VARCHAR(64) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS giveaways (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  channel_id VARCHAR(32) NOT NULL,
  message_id VARCHAR(32) NOT NULL,
  prize TEXT NOT NULL,
  winners_count INT DEFAULT 1,
  required_role VARCHAR(32),
  min_account_age INT DEFAULT 0,
  bonus_entries BOOLEAN DEFAULT FALSE,
  ends_at TIMESTAMP NOT NULL,
  ended BOOLEAN DEFAULT FALSE,
  paused BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(32) NOT NULL
);
CREATE TABLE IF NOT EXISTS giveaway_entries (
  id SERIAL PRIMARY KEY,
  giveaway_id INT REFERENCES giveaways(id) ON DELETE CASCADE,
  user_id VARCHAR(32) NOT NULL,
  entries INT DEFAULT 1,
  UNIQUE (giveaway_id, user_id)
);
CREATE TABLE IF NOT EXISTS levels (
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  xp BIGINT DEFAULT 0,
  level INT DEFAULT 0,
  last_xp TIMESTAMP,
  PRIMARY KEY (user_id, guild_id)
);
CREATE TABLE IF NOT EXISTS level_rewards (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  level INT NOT NULL,
  role_id VARCHAR(32) NOT NULL
);
CREATE TABLE IF NOT EXISTS welcome_settings (
  guild_id VARCHAR(32) PRIMARY KEY,
  welcome_channel VARCHAR(32),
  goodbye_channel VARCHAR(32),
  welcome_message TEXT,
  goodbye_message TEXT,
  autorole VARCHAR(32),
  verify_channel VARCHAR(32),
  verify_role VARCHAR(32)
);
CREATE TABLE IF NOT EXISTS verification (
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  method VARCHAR(32),
  verified_at TIMESTAMP,
  PRIMARY KEY (user_id, guild_id)
);
CREATE TABLE IF NOT EXISTS automod_settings (
  guild_id VARCHAR(32) PRIMARY KEY,
  settings JSONB DEFAULT '{}'::jsonb
);
CREATE TABLE IF NOT EXISTS logs_config (
  guild_id VARCHAR(32) PRIMARY KEY,
  channels JSONB DEFAULT '{}'::jsonb
);
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32),
  text TEXT NOT NULL,
  remind_at TIMESTAMP NOT NULL,
  done BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS birthdays (
  user_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  month INT NOT NULL,
  day INT NOT NULL,
  PRIMARY KEY (user_id, guild_id)
);
CREATE TABLE IF NOT EXISTS suggestions (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  user_id VARCHAR(32) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(16) DEFAULT 'pending',
  votes_up INT DEFAULT 0,
  votes_down INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS starboard (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  message_id VARCHAR(32) NOT NULL,
  channel_id VARCHAR(32) NOT NULL,
  star_count INT DEFAULT 0,
  starboard_msg_id VARCHAR(32)
);
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  title TEXT,
  content TEXT,
  created_by VARCHAR(32),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS owner_actions (
  id SERIAL PRIMARY KEY,
  owner_id VARCHAR(32) NOT NULL,
  action VARCHAR(64) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_economy_guild ON economy(guild_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id, guild_id);
CREATE INDEX IF NOT EXISTS idx_warnings_user ON warnings(user_id, guild_id);
CREATE INDEX IF NOT EXISTS idx_tickets_guild ON tickets(guild_id);
CREATE INDEX IF NOT EXISTS idx_levels_guild ON levels(guild_id);
`;

async function migrate() {
  await db.query(schema);
  console.log('Migration complete');
}

module.exports = { migrate };
if (require.main === module) {
  const dbm = require('./db');
  dbm.init().then(() => migrate()).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}

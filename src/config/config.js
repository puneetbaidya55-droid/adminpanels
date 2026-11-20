require('dotenv').config();
module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,
  owners: (process.env.OWNER_IDS || '').split(',').map(s => s.trim()).filter(Boolean),
  database: {
    url: process.env.DATABASE_URL || null,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'wsgt_bot',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  dashboard: {
    port: parseInt(process.env.DASHBOARD_PORT || '3000'),
    secret: process.env.DASHBOARD_SECRET || 'change_me',
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackUrl: process.env.DASHBOARD_CALLBACK_URL,
    url: process.env.DASHBOARD_URL || 'http://localhost:3000',
  },
  lavalink: {
    host: process.env.LAVALINK_HOST || 'localhost',
    port: parseInt(process.env.LAVALINK_PORT || '2333'),
    password: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
  },
  weatherKey: process.env.WEATHER_API_KEY || '',
  logLevel: process.env.LOG_LEVEL || 'info',
  env: process.env.NODE_ENV || 'development',
};

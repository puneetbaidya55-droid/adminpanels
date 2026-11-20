const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const config = require('./config/config');
const logger = require('./utils/logger');
const db = require('./database/db');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.config = config;

// Load commands
const fs = require('fs');
const path = require('path');

function loadCommands(dir) {
  const fullPath = path.join(__dirname, 'commands', dir);
  if (!fs.existsSync(fullPath)) return;
  for (const file of fs.readdirSync(fullPath)) {
    if (file.endsWith('.js')) {
      try {
        const cmd = require(path.join(fullPath, file));
        if (cmd.data && cmd.execute) {
          client.commands.set(cmd.data.name, cmd);
        }
      } catch (e) {
        logger.error(`Failed to load command ${file}: ${e.message}`);
      }
    }
  }
}
for (const dir of fs.readdirSync(path.join(__dirname, 'commands'))) {
  loadCommands(dir);
}

// Load events
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath)) {
  if (file.endsWith('.js')) {
    const event = require(path.join(eventsPath, file));
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
  }
}

async function start() {
  try {
    await db.init();
    logger.info('Database connected');
    await client.login(config.token);
  } catch (e) {
    logger.error(`Startup failed: ${e.message}`);
    process.exit(1);
  }
}

start();

module.exports = client;

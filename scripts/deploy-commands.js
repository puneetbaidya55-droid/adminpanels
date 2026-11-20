require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../src/config/config');

const commands = [];
const commandsPath = path.join(__dirname, '..', 'src', 'commands');
for (const dir of fs.readdirSync(commandsPath)) {
  const dirPath = path.join(commandsPath, dir);
  if (!fs.statSync(dirPath).isDirectory()) continue;
  for (const file of fs.readdirSync(dirPath)) {
    if (!file.endsWith('.js')) continue;
    const cmd = require(path.join(dirPath, file));
    if (cmd.data) commands.push(cmd.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
  try {
    console.log(`Deploying ${commands.length} commands...`);
    if (config.guildId) {
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
      console.log('Deployed to guild.');
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
      console.log('Deployed globally.');
    }
  } catch (e) {
    console.error(e);
  }
})();

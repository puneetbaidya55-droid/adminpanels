const { Events, Collection } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // cooldown
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.data.name) || new Collection();
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(interaction.user.id)) {
      const expiration = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expiration) {
        const remaining = (expiration - now) / 1000;
        return interaction.reply({ content: `Please wait ${remaining.toFixed(1)}s before using this command again.`, ephemeral: true });
      }
    }
    timestamps.set(interaction.user.id, now);
    client.cooldowns.set(command.data.name, timestamps);

    try {
      await command.execute(interaction, client);
    } catch (e) {
      logger.error(`Command ${interaction.commandName} error: ${e.stack || e.message}`);
      const msg = { content: 'There was an error executing this command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {});
      else await interaction.reply(msg).catch(() => {});
    }
  },
};

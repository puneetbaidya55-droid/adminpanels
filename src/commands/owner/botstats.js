const { SlashCommandBuilder } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const db = require('../../database/db');
module.exports = {
  data: new SlashCommandBuilder().setName('botstats').setDescription('Bot statistics (owner only)'),
  async execute(interaction) {
    if (!isOwner(interaction.user.id)) return interaction.reply({ content: 'Owner only.', ephemeral: true });
    const guilds = interaction.client.guilds.cache.size;
    const users = interaction.client.users.cache.size;
    const r = await db.query('SELECT COUNT(*)::int AS c FROM users');
    await interaction.reply({ content: `Guilds: ${guilds}\nCached users: ${users}\nDB users: ${r.rows[0].c}`, ephemeral: true });
  },
};

const { Events, ChannelType, PermissionFlagsBits } = require('discord.js');
const db = require('../database/db');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('ticket_')) return;
    const guild = interaction.guild;
    const category = interaction.customId.replace('ticket_', '');
    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      ],
    });
    await db.query('INSERT INTO tickets (guild_id,channel_id,user_id,category) VALUES ($1,$2,$3,$4)', [guild.id, channel.id, interaction.user.id, category]);
    await channel.send(`Welcome ${interaction.user}, a staff member will assist you shortly. Category: **${category}**`);
    await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
  },
};

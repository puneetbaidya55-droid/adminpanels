const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/db');
module.exports = {
  data: new SlashCommandBuilder().setName('ban').setDescription('Ban a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .addIntegerOption(o => o.setName('days').setDescription('Delete message days (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const days = interaction.options.getInteger('days') || 0;
    await interaction.guild.members.ban(user, { reason, deleteMessageSeconds: days * 86400 });
    await db.query('INSERT INTO mod_logs (guild_id,action,target_id,moderator_id,reason) VALUES ($1,$2,$3,$4,$5)', [interaction.guildId, 'ban', user.id, interaction.user.id, reason]);
    await interaction.reply({ content: `Banned ${user.tag}. Reason: ${reason}` });
  },
};

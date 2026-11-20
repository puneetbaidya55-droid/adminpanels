const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/db');
module.exports = {
  data: new SlashCommandBuilder().setName('kick').setDescription('Kick a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');
    if (!target) return interaction.reply({ content: 'Member not found.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: 'I cannot kick this member.', ephemeral: true });
    if (target.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ content: 'You cannot kick someone with equal or higher role.', ephemeral: true });
    }
    await target.kick(reason);
    await db.query('INSERT INTO mod_logs (guild_id,action,target_id,moderator_id,reason) VALUES ($1,$2,$3,$4,$5)', [interaction.guildId, 'kick', target.id, interaction.user.id, reason]);
    await interaction.reply({ content: `Kicked ${target.user.tag}. Reason: ${reason}` });
  },
};

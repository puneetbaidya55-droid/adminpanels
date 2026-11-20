const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ticket').setDescription('Ticket system')
    .addSubcommand(s => s.setName('panel').setDescription('Send ticket panel')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ content: 'No permission.', ephemeral: true });
    }
    const embed = new EmbedBuilder().setColor(0x00bfff).setTitle('WSGT Support Tickets')
      .setDescription('Click a button below to open a ticket.');
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_general').setLabel('General Support').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ticket_report').setLabel('Player Report').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('ticket_appeal').setLabel('Ban Appeal').setStyle(ButtonStyle.Secondary),
    );
    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Ticket panel sent.', ephemeral: true });
  },
};

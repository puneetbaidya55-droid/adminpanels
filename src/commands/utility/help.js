const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Show WSGT BOT help'),
  async execute(interaction) {
    const embed = new EmbedBuilder().setColor(0x00bfff).setTitle('WSGT BOT Help')
      .setDescription('All-in-one Discord management bot for Shadowplay RP.\nUse slash commands. Categories: Economy, Moderation, Tickets, Staff, Announcements, Giveaways, Levels, Welcome, AutoMod, Utility, Fun, Owner.')
      .addFields({ name: 'Support', value: 'Open a ticket for help.' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

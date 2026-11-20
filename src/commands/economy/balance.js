const { SlashCommandBuilder } = require('discord.js');
const econ = require('../../services/economyService');
const { info } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('balance').setDescription('Check your WSGT Credits balance')
    .addUserOption(o => o.setName('user').setDescription('User to check')),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const b = await econ.getBalance(target.id, interaction.guildId);
    await interaction.reply({ embeds: [info('WSGT Credits Balance', `**${target.username}**\nWallet: **${b.balance}** credits\nBank: **${b.bank}** credits\nTotal: **${b.balance + b.bank}**`)] });
  },
};

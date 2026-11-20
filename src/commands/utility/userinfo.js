const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('userinfo').setDescription('Show user info')
    .addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const u = interaction.options.getUser('user') || interaction.user;
    const m = await interaction.guild.members.fetch(u.id).catch(() => null);
    const embed = new EmbedBuilder().setColor(0x00bfff).setTitle('User Info')
      .setThumbnail(u.displayAvatarURL())
      .addFields(
        { name: 'Username', value: u.tag, inline: true },
        { name: 'ID', value: u.id, inline: true },
        { name: 'Created', value: `<t:${Math.floor(u.createdTimestamp/1000)}:F>`, inline: false },
        { name: 'Joined', value: m ? `<t:${Math.floor(m.joinedTimestamp/1000)}:F>` : 'N/A', inline: false },
        { name: 'Roles', value: m ? m.roles.cache.filter(r=>r.id!==interaction.guild.id).map(r=>r.toString()).join(', ') || 'None' : 'N/A' }
      );
    await interaction.reply({ embeds: [embed] });
  },
};

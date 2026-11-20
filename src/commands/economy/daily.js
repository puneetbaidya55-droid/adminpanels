const { SlashCommandBuilder } = require('discord.js');
const econ = require('../../services/economyService');
const db = require('../../database/db');
const { success, error } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('daily').setDescription('Claim your daily WSGT Credits'),
  cooldown: 5,
  async execute(interaction) {
    const b = await econ.getBalance(interaction.user.id, interaction.guildId);
    const now = new Date();
    if (b.last_daily) {
      const diff = now - new Date(b.last_daily);
      if (diff < 24 * 60 * 60 * 1000) {
        const remaining = 24*60*60*1000 - diff;
        const h = Math.floor(remaining/3600000);
        const m = Math.floor((remaining%3600000)/60000);
        return interaction.reply({ embeds: [error('Daily Cooldown', `You can claim again in ${h}h ${m}m.`)], ephemeral: true });
      }
    }
    // streak
    let streak = b.daily_streak || 0;
    if (b.last_daily) {
      const diff = now - new Date(b.last_daily);
      if (diff <= 48 * 60 * 60 * 1000) streak += 1; else streak = 1;
    } else streak = 1;
    const base = 100;
    const bonus = Math.min(streak * 10, 200);
    const reward = base + bonus;
    await db.query('UPDATE economy SET balance=balance+$1, last_daily=NOW(), daily_streak=$2 WHERE user_id=$3 AND guild_id=$4', [reward, streak, interaction.user.id, interaction.guildId]);
    await db.query('INSERT INTO transactions (user_id,guild_id,type,amount,description) VALUES ($1,$2,$3,$4,$5)', [interaction.user.id, interaction.guildId, 'daily', reward, `Daily reward (streak ${streak})`]);
    await interaction.reply({ embeds: [success('Daily Claimed', `You received **${reward}** WSGT Credits!\nStreak: **${streak}** days (+${bonus} bonus)`)] });
  },
};

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    const logger = require('../utils/logger');
    logger.info(`WSGT BOT logged in as ${client.user.tag}`);
    client.user.setActivity('WSGT BOT | /help', { type: 3 });
  },
};

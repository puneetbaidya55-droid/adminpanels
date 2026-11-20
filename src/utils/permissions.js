const config = require('../config/config');
function isOwner(userId) {
  return config.owners.includes(userId);
}
function isAdmin(member) {
  return member.permissions.has('Administrator');
}
module.exports = { isOwner, isAdmin };

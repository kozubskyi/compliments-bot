const commands = require('../helpers/commands');

module.exports = function handleHelpCommand(status) {
  let reply = '';

  if (status === 'creator') {
    reply = commands.admin;
  } else {
    reply = commands.standart;
  }

  return reply;
};

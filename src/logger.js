const chalk = require('chalk');

class Logger {
  static log(msg) {
    console.log(chalk`{white.bold ${msg}}`);
  }

  static error(msg) {
    console.log(chalk`{red ${msg}}`);
  }
}

module.exports = { Logger };

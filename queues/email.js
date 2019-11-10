const Email = require('email-templates');

const { logger } = require('../helpers');
const config = require('../config');

const email = new Email(config.email);

module.exports = async job => {
  try {
    logger.info('sending email', { job });
    await email.send(job.data);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

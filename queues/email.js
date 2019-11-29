const Email = require('email-templates');
const _ = require('lodash');
const customFonts = require('custom-fonts-in-emails');

const { logger } = require('../helpers');
const config = require('../config');

const email = new Email(config.email);

module.exports = async job => {
  try {
    logger.info('sending email', { job });
    if (!_.isObject(job.data.locals)) job.data.locals = {};
    job.data.locals.appNameImage = await customFonts.png2x({
      text: config.appName,
      fontSize: 30,
      backgroundColor: '#f8f9fa',
      fontNameOrPath: 'Bitter Regular'
    });
    const res = await email.send(job.data);
    logger.info('email response', { res });
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const config = require('.');
const cookieOptions = require('./cookies');
const routes = require('../routes');
const i18n = require('../helpers/i18n');
const logger = require('../helpers/logger');
const passport = require('../helpers/passport');

const webConfig = {
  routes: routes.web,
  logger,
  i18n,
  cookies: cookieOptions,
  meta: config.meta,
  views: config.views,
  passport
};

module.exports = webConfig;

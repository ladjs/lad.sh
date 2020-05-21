const config = require('.');
const routes = require('../routes');
const i18n = require('../helpers/i18n');
const logger = require('../helpers/logger');
const passport = require('../helpers/passport');

const webConfig = {
  routes: routes.web,
  logger,
  i18n,
  meta: config.meta,
  views: config.views,
  passport
};

module.exports = webConfig;

const routes = require('../routes');
const i18n = require('../helpers/i18n');
const logger = require('../helpers/logger');
const passport = require('../helpers/passport');

const apiConfig = {
  routes: routes.api,
  logger,
  i18n,
  passport
};

module.exports = apiConfig;

const sharedConfig = require('@ladjs/shared-config');

const config = require('../config');
const routes = require('../routes');
const i18n = require('../helpers/i18n');
const logger = require('../helpers/logger');
const passport = require('../helpers/passport');

const webSharedConfig = sharedConfig('WEB');

const defaultSrc = ["'self'", 'data:', `*.${process.env.WEB_HOST}:*`];

const webConfig = {
  ...webSharedConfig,
  routes: routes.web,
  logger,
  i18n,
  meta: config.meta,
  views: config.views,
  passport,
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc,
        connectSrc: [...defaultSrc, 'localhost:*', 'ws://localhost:*'],
        fontSrc: [...defaultSrc, 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
        imgSrc: defaultSrc,
        styleSrc: [...defaultSrc, "'unsafe-inline'"],
        scriptSrc: [...defaultSrc, "'unsafe-inline'", 'localhost:*']
      }
    }
  }
};

module.exports = webConfig;

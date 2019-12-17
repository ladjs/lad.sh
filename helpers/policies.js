const Policies = require('@ladjs/policies');

const { verificationPath, userFields, appName } = require('../config');
const { Users } = require('../app/models');

const policies = new Policies(
  {
    schemeName: appName,
    hasVerifiedEmail: userFields.hasVerifiedEmail,
    verifyRoute: verificationPath
  },
  apiToken => {
    const query = {};
    query[userFields.apiToken] = apiToken;
    return Users.findOne(query);
  }
);

policies.ensure2fa = (ctx, next) => {
  if (!ctx.isAuthenticated() || (ctx.state.user.two_factor_enabled && !ctx.session.secondFactor)) {
    ctx.session.returnTo = ctx.originalUrl || ctx.req.url;
    if (!ctx.is('json'))
      ctx.flash(
        'warning',
        ctx.translate
           ? ctx.translate('TWO_FACTOR_REQUIRED')
          : 'Please log in with two factor authentication to view the page you requested.'
        );
    ctx.redirect('/login-otp');
    return;
  }

  return next();
}

module.exports = policies;

const Passport = require('@ladjs/passport');

const OtpStrategy = require('passport-otp-strategy').Strategy;
const crypto = require('crypto');

const config = require('../config');
const { Users } = require('../app/models');

const passport = new Passport(Users, config.passport);

if (process.env.ENABLE_OTP_STRATEGY)
  passport.use(new OtpStrategy(
  {
    codeField: 'passcode',
    authenticator: {
      crypto,
      step: 30
    }
  },
  function(user, done) {
    // we already have the user object from initial login
    return done(null, user.two_factor_token);
  }));

module.exports = passport;

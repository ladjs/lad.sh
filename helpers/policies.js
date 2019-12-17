const Policies = require('@ladjs/policies');

const { verificationPath, userFields, appName } = require('../config');
const { Users } = require('../app/models');

const policies = new Policies(
  {
    schemeName: appName,
    hasVerifiedEmail: userFields.hasVerifiedEmail,
    twoFactorEnabled: userFields.twoFactorEnabled,
    verifyRoute: verificationPath
  },
  apiToken => {
    const query = {};
    query[userFields.apiToken] = apiToken;
    return Users.findOne(query);
  }
);

module.exports = policies;

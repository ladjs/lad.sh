const Policies = require('@ladjs/policies');

const {
  loginOtpPath,
  verificationPath,
  userFields,
  appName
} = require('../config');
const { Users } = require('../app/models');

const policies = new Policies(
  {
    schemeName: appName,
    userFields,
    verifyRoute: verificationPath,
    loginOtpRoute: loginOtpPath
  },
  apiToken => {
    const query = {};
    query[userFields.apiToken] = apiToken;
    return Users.findOne(query);
  }
);

module.exports = policies;

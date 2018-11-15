let userDBHelper
let accessTokensDBHelper

getClient = (clientID, clientSecret, callback) => {
  const client = {
    clientID,
    clientSecret,
    grants: null,
    redirectUris: null
  }

  callback(false, client);
}

getUser = (username, password, callback) => userDBHelper
  .getUserFromCrentials(username, password, callback)

saveAccessToken = (accessToken, clientID, expires, user, callback) => accessTokensDBHelper
  .saveAccessToken(accessToken, user.id, callback)

getAccessToken = (bearerToken, callback) => accessTokensDBHelper.getUserIDFromBearerToken(bearerToken, (userID) => {
  const accessToken = {
    user: {
      id: userID,
    },
    expires: null
  }
  callback(userID == null ? true : false, userID == null ? null : accessToken)
})

grantTypeAllowed = (clientID, grantType, callback) => callback(false, true);

module.exports = (injectedUserDBHelper, injectedAccessTokensDBHelper) => {
  userDBHelper = injectedUserDBHelper
  accessTokensDBHelper = injectedAccessTokensDBHelper

  return {
    getClient: getClient,
    saveAccessToken: saveAccessToken,
    getUser: getUser,
    getAccessToken: getAccessToken,
    grantTypeAllowed: grantTypeAllowed,
  }
}
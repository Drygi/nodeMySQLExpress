let mySqlConnection

saveAccessToken = (accessToken, userID, callback) => {
  const getUserQuery = `INSERT INTO access_tokens (access_token, user_id) VALUES 
    ("${accessToken}", ${userID}) ON DUPLICATE KEY UPDATE access_token = "${accessToken}";`

  mySqlConnection.query(getUserQuery, (dataResponseObject) => {
    callback(dataResponseObject.error)
  })
}

getUserIDFromBearerToken = (bearerToken, callback) => {
  const getUserIDQuery = `SELECT * FROM access_tokens WHERE access_token = '${bearerToken}';`

  mySqlConnection.query(getUserIDQuery, (dataResponseObject) => {
    const userID = dataResponseObject.results != null && dataResponseObject.results.length == 1
      ? dataResponseObject.results[0].user_id
      : null;

    callback(userID)
  });
}

module.exports = injectedMySqlConnection => {
  mySqlConnection = injectedMySqlConnection

  return {
    saveAccessToken: saveAccessToken,
    getUserIDFromBearerToken: getUserIDFromBearerToken
  }
}
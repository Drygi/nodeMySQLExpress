let mySqlConnection;

registerUserInDB = (username, password, registrationCallback) => {
  const registerUserQuery = `INSERT INTO users (username, user_password) VALUES ('${username}', SHA2('${password}', 512))`

  mySqlConnection.query(registerUserQuery, registrationCallback)
}

getUserFromCrentials = (username, password, callback) => {
  const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND user_password = SHA2('${password}', 512)`

  mySqlConnection.query(getUserQuery, (dataResponseObject) => {
    callback(false, dataResponseObject.results !== null
      && dataResponseObject.results.length === 1 ? dataResponseObject.results[0] : null)
  })
}

doesUserExist = (username, callback) => {
  const doesUserExistQuery = `SELECT * FROM users WHERE username = '${username}'`

  const sqlCallback = (dataResponseObject) => {
    const doesUserExist = dataResponseObject.results !== null
      ? dataResponseObject.results.length > 0
        ? true
        : false
      : null

    callback(dataResponseObject.error, doesUserExist)
  }

  mySqlConnection.query(doesUserExistQuery, sqlCallback)
}

module.exports = injectedMySqlConnection => {
  mySqlConnection = injectedMySqlConnection

  return {
    registerUserInDB: registerUserInDB,
    getUserFromCrentials: getUserFromCrentials,
    doesUserExist: doesUserExist
  }
}
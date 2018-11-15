let userDBHelper

registerUser = (req, res) => userDBHelper
  .doesUserExist(req.body.username, (sqlError, doesUserExist) => {

    if (sqlError !== null || doesUserExist) {
      const message = sqlError !== null
        ? "Operation unsuccessful"
        : "User already exists";

      const error = sqlError !== null
        ? sqlError
        : "User already exists";

      sendResponse(res, message, sqlError);
      return;
    }

    userDBHelper.registerUserInDB(req.body.username, req.body.password, dataResponseObject => {
      const message = dataResponseObject.error === null
        ? "Registration was successful"
        : "Failed to register user";

      sendResponse(res, message, dataResponseObject.error);
    })
  });

sendResponse = (res, message, error) => res
  .status(message === "Registration was successful" ? 200 : 400)
  .json({
    'message': message,
    'error': error,
  });

module.exports = injectedUserDBHelper => {
  userDBHelper = injectedUserDBHelper

  return {
    registerUser: registerUser,
  }
}

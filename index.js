const port = 3000
var models = require('./models');
const mySqlConnection = require('./dbHelpers/mySqlWrapper')
const accessTokenDBHelper = require('./dbHelpers/accessTokenDBHelper')(mySqlConnection)
const userDBHelper = require('./dbHelpers/userDBHelper')(mySqlConnection)
const oAuthModel = require('./authorization/accessTokenModel')(userDBHelper, accessTokenDBHelper)
const oAuth2Server = require('node-oauth2-server')
const express = require('express')
const expressApp = express()

expressApp.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})

const authRoutesMethods = require('./authorization/authRoutesMethods')(userDBHelper)
const authRoutes = require('./authorization/authRoutes')(express.Router(), expressApp, authRoutesMethods, models, accessTokenDBHelper)
const bodyParser = require('body-parser')

expressApp.use(bodyParser.urlencoded({ extended: true }))
expressApp.use(expressApp.oauth.errorHandler())
expressApp.use('/auth', authRoutes)

models.sequelize.sync().then(() => {
  expressApp.listen(port, () => {
    console.log(`listening on port ${port}`)
  });
});
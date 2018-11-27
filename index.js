const port = 3000
var models = require('./models');
const mySqlConnection = require('./dbHelpers/mySqlWrapper')
const accessTokenDBHelper = require('./dbHelpers/accessTokenDBHelper')(mySqlConnection)
const userDBHelper = require('./dbHelpers/userDBHelper')(mySqlConnection)
const oAuthModel = require('./authorization/accessTokenModel')(userDBHelper, accessTokenDBHelper)
const oAuth2Server = require('node-oauth2-server')
const express = require('express')
const RateLimit = require('express-rate-limit');
const expressApp = express()

expressApp.enable('trust proxy')

var apiLimiter = new RateLimit({
  windowMs: 15*60*1000,
  max: 100,
  delayMs: 0
})

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
expressApp.use('/auth', authRoutes, apiLimiter)

models.sequelize.sync().then(() => {
  expressApp.listen(port, () => {
    console.log(`listening on port ${port}`)
  });
});
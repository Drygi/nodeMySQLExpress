//konfiguraja sequlize

'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


// db.illnesses = require('../models/illnesses.js')(sequelize, Sequelize);
// db.illnessesmedicineses = require('../models/illnessesmedicineses.js')(sequelize, Sequelize);
// db.medicines = require('../models/medicines.js')(sequelize, Sequelize);
// db.patientillnesses = require('../models/patientillnesses.js')(sequelize, Sequelize);
db.clients = require('../models/clients.js')(sequelize, Sequelize);
db.users = require('../models/users.js')(sequelize, Sequelize);
db.usertoclients = require('../models/usersToclients.js')(sequelize, Sequelize);

//  db.medicines.hasMany(db.illnessesmedicineses);
//  db.illnessesmedicineses.belongsTo(db.medicines);
//  db.illnessesmedicineses.belongsTo(db.illnesses);
//  db.illnesses.hasMany(db.illnessesmedicineses);

//  db.illnesses.hasMany(db.patientillnesses);
//  db.patientillnesses.belongsTo(db.illnesses);

module.exports = db;
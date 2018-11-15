/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('access_tokens', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'access_tokens'
  });
};

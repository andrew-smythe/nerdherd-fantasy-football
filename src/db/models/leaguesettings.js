const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('leaguesettings', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numWeeksRegular: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numWeeksPlayoffs: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numTeams: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numTeamsPlayoffs: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    source: {
      type: DataTypes.ENUM('nfl','sleeper'),
      allowNull: false,
      defaultValue: "nfl"
    }
  }, {
    sequelize,
    tableName: 'leaguesettings',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

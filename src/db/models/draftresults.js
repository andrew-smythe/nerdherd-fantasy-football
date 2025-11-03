const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('draftresults', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    team: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    draftPosition: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    source: {
      type: DataTypes.ENUM('nfl','sleeper'),
      allowNull: false,
      defaultValue: "nfl"
    }
  }, {
    sequelize,
    tableName: 'draftresults',
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
      {
        name: "draftTeamId_idx",
        using: "BTREE",
        fields: [
          { name: "teamId" },
        ]
      },
    ]
  });
};

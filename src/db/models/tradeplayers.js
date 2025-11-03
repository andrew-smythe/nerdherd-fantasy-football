const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tradeplayers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tradeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    originalTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    newTeamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    team: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    source: {
      type: DataTypes.ENUM('nfl','sleeper'),
      allowNull: false,
      defaultValue: "nfl"
    }
  }, {
    sequelize,
    tableName: 'tradeplayers',
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
        name: "originalTeam_idx",
        using: "BTREE",
        fields: [
          { name: "originalTeamId" },
        ]
      },
      {
        name: "newTeam_idx",
        using: "BTREE",
        fields: [
          { name: "newTeamId" },
        ]
      },
    ]
  });
};

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trades', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    team1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    team2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    vetoed: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    year: {
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
    tableName: 'trades',
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
        name: "tradeTeam1_idx",
        using: "BTREE",
        fields: [
          { name: "team1" },
        ]
      },
      {
        name: "tradeTeam2_idx",
        using: "BTREE",
        fields: [
          { name: "team2" },
        ]
      },
    ]
  });
};

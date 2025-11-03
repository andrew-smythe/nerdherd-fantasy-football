const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sleeperplayers', {
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
    rosterPositionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rosterpositions',
        key: 'id'
      }
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    sleeperId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'sleeperplayers',
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
        name: "rosterPositionId_idx",
        using: "BTREE",
        fields: [
          { name: "rosterPositionId" },
        ]
      },
    ]
  });
};

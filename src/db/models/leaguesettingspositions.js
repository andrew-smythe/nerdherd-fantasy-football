const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('leaguesettingspositions', {
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
    rosterPositionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rosterpositions',
        key: 'id'
      }
    },
    numSlots: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'leaguesettingspositions',
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
        name: "rosterPosition",
        using: "BTREE",
        fields: [
          { name: "rosterPositionId" },
        ]
      },
    ]
  });
};

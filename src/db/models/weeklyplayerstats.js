const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('weeklyplayerstats', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    team: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    opponent: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    playerPosition: {
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
    passingYards: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    passingTds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    passingInts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rushingYards: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rushingTds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    receivingYards: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    receivingTds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fumbles: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    twoPoints: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pats: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nineteenFgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    twentynineFgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    thirtynineFgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fourtynineFgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fiftyFgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sacks: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    defenseInts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fumbleRecoveries: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    safeties: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    defenseTds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    returnTds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pointsAllowed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalPoints: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    gameUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    source: {
      type: DataTypes.ENUM('nfl','sleeper'),
      allowNull: false,
      defaultValue: "nfl"
    }
  }, {
    sequelize,
    tableName: 'weeklyplayerstats',
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
        name: "teamId_idx",
        using: "BTREE",
        fields: [
          { name: "teamId" },
        ]
      },
      {
        name: "positionId_idx",
        using: "BTREE",
        fields: [
          { name: "rosterPositionId" },
        ]
      },
    ]
  });
};

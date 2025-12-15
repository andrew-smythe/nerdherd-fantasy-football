import PlayerStats from '@/classes/PlayerStats';
const { Op } = require('sequelize');

export default class MatchupStats {
    opponentId: number;
    week: number;
    playerStats: PlayerStats[];

    constructor(week: number, opponentId: number) {
        this.opponentId = opponentId;
        this.week = week;
        this.playerStats = [];
    }

    static async fetch(rawStats, teamId: number, week: number, opponentId: number) : Promise<MatchupStats> {
        let matchup = new MatchupStats(week, opponentId);

        for (let s of rawStats) {
            matchup.playerStats.push(new PlayerStats(
                s.name,
                s.team,
                s.opponent,
                s.playerPosition,
                s.rosterPositionId,
                s.passingYards,
                s.passingTds,
                s.passingInts,
                s.rushingYards,
                s.rushingTds,
                s.receivingYards,
                s.receivingTds,
                s.fumbles,
                s.twoPoints,
                s.pats,
                s.nineteenFgs,
                s.twentynineFgs,
                s.thirtynineFgs,
                s.fourtynineFgs,
                s.fiftyFgs,
                s.sacks,
                s.defenseInts,
                s.fumbleRecoveries,
                s.safeties,
                s.defenseTds,
                s.returnTds,
                s.pointsAllowed,
                s.totalPoints,
                s.gameUrl,
                s.source
            ));
        }

        return matchup;
    }

    totalPoints() : number {
        let total = 0;
        this.playerStats.forEach(p => {
            if (p.rosterPositionId !== 8) {
                total += p.totalPoints;
            }
        });

        return total;
    }
}
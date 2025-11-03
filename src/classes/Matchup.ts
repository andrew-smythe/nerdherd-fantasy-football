import { connect } from '@/db/utils/connect';
import PlayerStats from '@/classes/PlayerStats';
const { Op } = require('sequelize');

export default class Matchup {
    opponentId: number;
    week: number;
    playerStats: PlayerStats[];

    constructor(week: number, opponentId: number) {
        this.opponentId = opponentId;
        this.week = week;
        this.playerStats = [];
    }

    static async fetch(db, teamId: number, week: number, opponentId: number) : Promise<Matchup> {
        let matchup = new Matchup(week, opponentId);

        const rawStats = await db.weeklyplayerstats.findAll({
            where: {
                teamId: {
                    [Op.eq]: teamId,
                },
                week: {
                    [Op.eq]: week,
                },
            }
        });

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
}
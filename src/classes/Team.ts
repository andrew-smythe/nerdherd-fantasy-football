import MatchupStats from '@/classes/MatchupStats';
import LeagueSettings from '@/classes/LeagueSettings';
const { Op } = require('sequelize');

export default class Team {
    id: number;
    name: string;
    year: number;
    nflId: number;
    sleeperId: number;
    weeks: MatchupStats[];

    constructor(id: number, name: string, year: number, nflId: number, sleeperId: number) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.nflId = nflId;
        this.sleeperId = sleeperId;
        this.weeks = [];
    }

    static async fetch(db, id: number, name: string, year: number, nflId: number, sleeperId: number) : Promise<Team> {
        let team = new Team(id, name, year, nflId, sleeperId);

        const rawMatchups = await db.matchups.findAll({
            where: {
                teamId: id,
            }
        });

        const rawPlayerStats = await db.weeklyplayerstats.findAll({
            where: {
                teamId: id,
            }
        });

        for (let m of rawMatchups) {
            let playerStats = rawPlayerStats.filter(p => p.week == m.week);
            team.weeks.push(await MatchupStats.fetch(playerStats, id, m.week, m.opponentId));
        }

        return team;
    }

    async getMatchupDataByWeek(week: number) : Promise<MatchupStats | undefined> {
        return this.weeks.find(w => w.week === week);
    }

    async getRecordAtWeek(week: number, settings: LeagueSettings, db: any) : Promise<{ wins : number, losses : number }> {
        let wins = 0;
        let losses = 0;

        for (let i = 1; i < week; i++) {
            if (i > settings.numRegSeasonWeeks) break; // Only calculates reg season record
            let matchup = await this.getMatchupDataByWeek(i);
            let points = matchup!.playerStats.filter(ps => ps.rosterPositionId !== 8).reduce((acc, ps) => acc + ps.totalPoints, 0);
            
            let opponentId = matchup!.opponentId;
            const opponentPlayerStats = await db.weeklyplayerstats.findAll({
                where: {
                    teamId: opponentId,
                    week: i,
                    rosterPositionId: {
                        [Op.ne]: 8
                    },
                },
            });
            let opponentPoints = opponentPlayerStats.reduce((acc, ops) => acc + ops.totalPoints, 0);
            
            if (points > opponentPoints) {
                wins++;
            }
            else {
                losses++;
            }
        }
        return {
            wins: wins,
            losses: losses,
        };
    }
}
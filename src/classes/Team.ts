import Matchup from '@/classes/Matchup';
import MatchupStats from '@/classes/MatchupStats';
import LeagueSettings from '@/classes/LeagueSettings';
import Standing from '@/classes/Standing';
import { connect } from '@/db/utils/connect';
const { Op } = require('sequelize');

export default class Team {
    id: number;
    name: string;
    year: number;
    userId: number;
    nflId: number;
    sleeperId: number;
    matchups: Matchup[];

    constructor(id: number, name: string, year: number, userId: number, nflId: number, sleeperId: number, matchups) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.userId = userId;
        this.nflId = nflId;
        this.sleeperId = sleeperId;
        this.matchups = matchups;
    }

    static async fetch(id: number) : Promise<Team | undefined> {
        const db = connect();

        const rawTeamData = await db.teams.findByPk(id, {
            include: 'team_matchups',
        });
        if (!rawTeamData) {
            console.error('Could not find Team data for ID ' + id);
            return undefined;
        }
        const matchups : Matchup[] = [];
        for (let m of rawTeamData.team_matchups) {
            matchups.push(new Matchup(m.id, m.teamId, m.opponentId, m.week, m.totalPoints, m.opponentTotalPoints, (m.winner === m.teamId || m.opponentId === null), m.opponentId === null));
        }

        let team = new Team(rawTeamData.id, rawTeamData.name, rawTeamData.year, rawTeamData.userId, rawTeamData.nflId, rawTeamData.sleeperId, matchups);

        db.sequelize.close();

        return team;
    }

    async getMatchupDataByWeek(week: number) : Promise<MatchupStats | undefined> {
        const matchup = this.matchups.find(m => m.week === week);
        if (!matchup) {
            return undefined;
        }

        const db = connect();
        const rawPlayerStats = await db.weeklyplayerstats.findAll({
            where: {
                teamId: this.id,
                week: week,
            }
        });

        db.sequelize.close();

        return await MatchupStats.fetch(rawPlayerStats, this.id, matchup.week, matchup.opponentId);

    }

    async getRecordBeforeWeek(week: number, settings: LeagueSettings) : Promise<Standing> {
        return await this.getRecordAtWeek(week-1, settings);
    }

    async getRecordAtWeek(week: number, settings: LeagueSettings) : Promise<Standing> {
        let wins = 0;
        let losses = 0;

        for (let i = 1; i <= week; i++) {
            if (i > settings.numRegSeasonWeeks) break; // Only calculates reg season record

            const matchup = this.matchups.find(m => m.week == i);
            if (!matchup) continue;

            if (matchup.win) {
                wins++;
            }
            else {
                losses++;
            }
        }
        return new Standing(this, wins, losses, await this.getTotalPointsAtWeek(week, settings));
    }

    async getTotalPointsAtWeek(week: number, settings: LeagueSettings) : Promise<number> {
        let totalPoints : number = 0;

        for (let i = 1; i <= week; i++) {
            if (i > settings.numRegSeasonWeeks) break; // Only calculates points in reg season

            const matchup = this.matchups.find(m => m.week == i);
            if (!matchup) continue;

            totalPoints += matchup.totalPoints;
        }

        return totalPoints;
    }

    async getTotalPointsAgainstAtWeek(week: number, settings: LeagueSettings) : Promise<number> {
        let totalPoints : number = 0;

        for (let i = 1; i <= week; i++) {
            if (i > settings.numRegSeasonWeeks) break; // Only calculates points in reg season

            const matchup = this.matchups.find(m => m.week == i);
            if (!matchup) continue;

            totalPoints += matchup.totalPoints;
        }

        return totalPoints;
    }

    async getRecord(settings: LeagueSettings) : Promise<Standing> {
        return this.getRecordAtWeek(settings.numRegSeasonWeeks, settings);
    }
}
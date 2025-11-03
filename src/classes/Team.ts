import { connect } from '@/db/utils/connect';
import Matchup from '@/classes/Matchup';
const { Op } = require('sequelize');

export default class Team {
    id: number;
    name: string;
    year: number;
    nflId: number;
    sleeperId: number;
    weeks: Matchup[];

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
                teamId: {
                    [Op.eq]: id,
                }
            }
        });

        for (let m of rawMatchups) {
            team.weeks.push(await Matchup.fetch(db, id, m.week, m.opponentId));
        }

        return team;
    }
}
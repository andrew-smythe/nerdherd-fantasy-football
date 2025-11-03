import { connect } from '@/db/utils/connect';
import Team from '@/classes/Team';
const { Op } = require('sequelize');

export default class User {
    id: number;
    teams: Team[];

    constructor(id : number) {
        this.id = id;
        this.teams = [];
    }

    static async fetch(id: number) : Promise<User> {
        let user = new User(id);
        const db = connect();

        const rawTeams = await db.teams.findAll({
            where: {
                userId: {
                    [Op.eq]: id,
                }
            },
        });

        for (let t of rawTeams) {
            user.teams.push(await Team.fetch(db, t.id, t.name, t.year, t.nflId, t.sleeperId));
        }

        return user;
    }
}
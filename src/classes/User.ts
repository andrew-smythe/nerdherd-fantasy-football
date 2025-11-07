import { connect } from '@/db/utils/connect';
import Team from '@/classes/Team';

export default class User {
    id: number;
    teams: Team[];
    name: string;

    constructor(id : number, name: string) {
        this.id = id;
        this.name = name;
        this.teams = [];
    }

    static async fetchByUserId(id: number) : Promise<User | undefined> {
        const db = connect();

        const userData = await db.users.findByPk(id);
        if (!userData) {
            console.error('Could not find User data for ID ' + id);
            return undefined;
        }
        let user = new User(id, userData.username);

        const rawTeams = await db.teams.findAll({
            where: {
                userId: id,
            },
        });

        for (let t of rawTeams) {
            user.teams.push(await Team.fetch(db, t.id, t.name, t.year, t.nflId, t.sleeperId));
        }

        return user;
    }

    static async fetchByTeamId(id: number) : Promise<User | undefined> {
        const db = connect();

        const rawTeamData = await db.teams.findByPk(id);
        if (!rawTeamData) {
            console.error('Could not find Team data for ID ' + id);
            return undefined;
        }

        return User.fetchByUserId(rawTeamData.userId);
    }

    static async fetchAllUsers() : Promise<{ id: number, name: string }[]> {
        const db = connect();

        const rawUsersData = await db.users.findAll();
        return rawUsersData.map(ud => ({
            id: ud.id,
            name: ud.username,
        }));
    }

    async getTeamByYear(year: number) : Promise<Team | undefined> {
        return this.teams.find(t => t.year === year);
    }
}
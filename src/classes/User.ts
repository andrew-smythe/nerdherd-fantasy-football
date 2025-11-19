import { connect } from '@/db/utils/connect';
import LeagueSettings from '@/classes/LeagueSettings';
import Standing from '@/classes/Standing';
import Team from '@/classes/Team';

class TeamData {
    id: number;
    name: string;
    year: number;
    source: string;

    constructor(id: number, name: string, year: number, source: string) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.source = source;
    }
}

export default class User {
    id: number;
    teams: TeamData[];
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
            user.teams.push(new TeamData(t.id, t.name, t.year, t.NflId !== null ? 'nfl' : 'sleeper'));
        }

        db.sequelize.close();

        return user;
    }

    static async fetchByTeamId(id: number) : Promise<User | undefined> {
        const db = connect();

        const rawTeamData = await db.teams.findByPk(id);
        if (!rawTeamData) {
            console.error('Could not find Team data for ID ' + id);
            return undefined;
        }

        db.sequelize.close();

        return User.fetchByUserId(rawTeamData.userId);
    }

    static async fetchAllUsersRaw() : Promise<{ id: number, name: string }[]> {
        const db = connect();

        const rawUsersData = await db.users.findAll();

        db.sequelize.close();
        return rawUsersData.map(ud => ({
            id: ud.id,
            name: ud.username,
        }));
    }

    static async fetchAllUsers() : Promise<User[]> {
        const db = connect();
        const rawUsersData = await db.users.findAll();

        let users : User[] = [];
        for (let rawUser of rawUsersData) {
            const user = await User.fetchByUserId(rawUser.id);
            if (user) {
                users.push(user);
            }
        }

        db.sequelize.close();
        return users;
    }

    async getTeamByYear(year: number) : Promise<Team | undefined> {
        const teamData = this.teams.find(t => t.year === year);
        if (teamData) {
            return Team.fetch(teamData.id);
        }
        return undefined;
    }

    async getAllTimeRecord(seasons : LeagueSettings[]) : Promise<{ wins: number, losses: number, totalPoints: number, numSeasons: number }> {
        let wins : number = 0;
        let losses : number = 0;
        let totalPoints : number = 0;
        let numSeasons : number = 0;

        for (let season of seasons) {
            const team : Team | undefined = await this.getTeamByYear(season.year);
            if (team) {
                const record : Standing = await team.getRecord(season);
                wins += record.wins;
                losses += record.losses;
                totalPoints += record.totalPoints;
                numSeasons++;
            }

        }
        return {
            wins: wins,
            losses: losses,
            totalPoints: totalPoints,
            numSeasons: numSeasons,
        }
    }
}
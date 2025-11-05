import MatchupStats from '@/classes/MatchupStats';

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
}
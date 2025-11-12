import { connect } from '@/db/utils/connect';
import Team from '@/classes/Team';
import LeagueSettings from '@/classes/LeagueSettings';

export default class Season {
    year: number;
    teams: Team[];
    settings: LeagueSettings;

    constructor(year: number, teams: Team[], settings: LeagueSettings) {
        this.year = year;
        this.teams = teams;
        this.settings = settings;
    }

    static async fetchSeasonByYear(year: number) : Promise<Season | undefined> {
        const db = connect();
        const settings = await LeagueSettings.loadYear(year);
        if (!settings) {
            console.error('Could not load season ' + year);
            return undefined;
        }

        const dbTeams = await db.teams.findAll({
            where: {
                year: year
            }
        });
        
        const teams : Team[] = [];
        for (let t of dbTeams) {
            const newTeam: Team | undefined = await Team.fetch(t.id);
            if (newTeam) {
                teams.push(newTeam);
            }
        }

        return new Season(year, teams, settings);
    }

    // CREATE CLASS FOR THIS RETURN TYPE
    async getRegularSeasonStandings() : Promise<{ team: Team, wins: number, losses: number, totalPoints: number }[]> {
        const ret : { team: Team, wins: number, losses: number, totalPoints: number }[] = [];
        const numRegSeasonWeeks = this.settings.numRegSeasonWeeks;

        for (let team of this.teams) {
            const record = await team.getRecordAtWeek(numRegSeasonWeeks, this.settings);
            ret.push({
                team: team,
                totalPoints: await team.getTotalPointsAtWeek(numRegSeasonWeeks, this.settings),
                wins: record.wins,
                losses: record.losses
            });
        }

        ret.sort((a, b) => {
            if (a.wins > b.wins) {
                return -1;
            }
            if (a.wins < b.wins) {
                return 1;
            }
            if (a.totalPoints > b.totalPoints) {
                return -1;
            }
            if (a.totalPoints < b.totalPoints) {
                return 1;
            }
            return 0;
        });

        return ret;
    }

    /* TODO - get playoff stuff
    async getPlayoffs() : Promise<Playoff> {

    }*/
}
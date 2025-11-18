import { connect } from '@/db/utils/connect';
import LeagueSettings from '@/classes/LeagueSettings';
import Matchup from '@/classes/Matchup';
import Playoff from '@/classes/Playoff';
import Team from '@/classes/Team';
import Standing from '@/classes/Standing';

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
    async getRegularSeasonStandings() : Promise<Standing[]> {
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

    async getPlayoffs() : Promise<Playoff> {
        const numWeeks = this.settings.numPlayoffWeeks;
        const numTeams = this.settings.numTeamsPlayoffs;
        const numByeTeams = Math.pow(2, numWeeks) - numTeams;

        let firstWeek = this.settings.numRegSeasonWeeks + 1;

        const playoffTeams = (await this.getRegularSeasonStandings()).slice(0, numTeams);
        const playoffTeamsArr : Team[][] = [];
        playoffTeamsArr[0] = [];
        for (let i = 0; i < playoffTeams.length; i++) {
            playoffTeamsArr[0].push(playoffTeams[i].team);
        }

        let nextWeekTeams : Team[] = [];
        for (let i = 0; i < numByeTeams; i++) {
            nextWeekTeams.push(playoffTeams[i].team);
        }

        for (let i = 0; i < numWeeks; i++) {
            // For each playoff week, determine the winners and add them to the next round
            let week : number = firstWeek + i;
            
            for (let j = 0; j < playoffTeamsArr[i].length; j++) {
                let team : Team = playoffTeamsArr[i][j];
                if (nextWeekTeams.find(t => t.id == team.id)) continue;

                let matchup : Matchup = team.matchups[week-1];
                let win : boolean = matchup.totalPoints > matchup.opponentTotalPoints ? true : false;
                if (win) {
                    nextWeekTeams.push(team);
                }
            }
            if (i < numWeeks - 1 ) {
                playoffTeamsArr[i+1] = [];
                playoffTeamsArr[i+1].push(...nextWeekTeams);
                nextWeekTeams = [];
            }
        }

        let playoff = new Playoff(this.year, firstWeek, numWeeks, playoffTeamsArr);
        return playoff;
    }
}
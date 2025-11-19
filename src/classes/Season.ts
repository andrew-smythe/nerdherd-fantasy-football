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

        db.sequelize.close();

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

    // Get a summary of all matchups for the Season
    // see: Playoff.getMatchupSummaryByWeek
    async getRegularSeasonMatchupSummaries() : Promise<any[][]> {
        const matchups : any = [];
        const numWeeks = this.settings.numRegSeasonWeeks;

        for (let i = 0; i < numWeeks; i++) {
            matchups.push([]);
            for (let team of this.teams) {
                let matchup = team.matchups[i];

                // Each matchup will be encountered twice - once for each player involved
                // We only want to add one entry per matchup
                const checkMatchup = matchups[i].findIndex(m =>
                    m.team1Id == matchup.teamId && m.team2Id == matchup.opponentId
                    || m.team1Id == matchup.opponentId && m.team2Id == matchup.teamId
                );

                if (checkMatchup < 0) {
                    const opponentTeam = this.teams.find(t => t.id == matchup.opponentId);
                    const record = await team.getRecordBeforeWeek(i+1, this.settings);
                    const opponentRecord = await opponentTeam?.getRecordBeforeWeek(i+1, this.settings);

                    matchups[i].push({
                        id: matchup.id,
                        team1Id: matchup.teamId,
                        team1Name: team.name,
                        team1UserId: team.userId,
                        team1Points: matchup.totalPoints,
                        team1Wins: record.wins,
                        team1Losses: record.losses,
                        team2Id: opponentTeam?.id,
                        team2Name: opponentTeam?.name,
                        team2UserId: opponentTeam?.userId,
                        team2Points: matchup.opponentTotalPoints,
                        team2Wins: opponentRecord?.wins,
                        team2Losses: opponentRecord?.losses,
                        week: matchup.week,
                        bye: matchup.bye,
                    });
                }
            }
        }

        return matchups;

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
import LeagueSettings from "@/classes/LeagueSettings";
import Team from "@/classes/Team";
import User from "@/classes/User";

export default class Playoff {
    year: number;
    startingWeek: number;
    numWeeks: number;
    weeks: Team[][];

    constructor(year: number, startingWeek: number, numWeeks: number, teams: Team[][]) {
        this.year = year;
        this.startingWeek = startingWeek;
        this.numWeeks = numWeeks;
        this.weeks = teams;
    }

    async getMatchupSummaryByWeek(week: number) : Promise<any> {
        let playoffWeek = this.startingWeek + (week - 1);
        let playoffTeams = this.weeks[week-1];
        let ret : any = [];

        for (let team of playoffTeams) {
            // Don't add team to summary if their matchup already exists
            if (ret.find(r => r.team1Id == team.id) || ret.find(r => r.team2Id == team.id)) continue;

            let matchup = team.matchups[playoffWeek-1];
            let opponentTeam = matchup.opponentId ? await Team.fetch(matchup.opponentId) : null;

            let settings = await LeagueSettings.loadYear(this.year);
            let teamRecord = await team.getRecord(settings!);
            let opponentRecord = opponentTeam ? await opponentTeam.getRecord(settings!) : null;
            
            ret.push({
                id: matchup.id,
                team1Id: team.id,
                team1Name: team.name,
                team1UserId: team.userId,
                team1Points: matchup.totalPoints,
                team1Wins: teamRecord.wins,
                team1Losses: teamRecord.losses,
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

        return ret;
    }
}
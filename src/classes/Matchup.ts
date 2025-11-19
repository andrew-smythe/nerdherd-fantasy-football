export default class Matchup {
    id: number;
    teamId: number;
    opponentId: number;
    week: number;
    totalPoints: number;
    opponentTotalPoints: number;
    win: boolean;
    bye: boolean;

    constructor(id: number, teamId: number, opponentId: number, week: number, totalPoints: number, opponentTotalPoints: number, win: boolean, bye: boolean) {
        this.id = id;
        this.teamId = teamId;
        this.opponentId = opponentId;
        this.week = week;
        this.totalPoints = totalPoints;
        this.opponentTotalPoints = opponentTotalPoints;
        this.win = win;
        this.bye = bye;
    }
}
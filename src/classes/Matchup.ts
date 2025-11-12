export default class Matchup {
    id: number;
    opponentId: number;
    week: number;
    totalPoints: number;
    opponentTotalPoints: number;
    win: boolean;

    constructor(id: number, opponentId: number, week: number, totalPoints: number, opponentTotalPoints: number, win: boolean) {
        this.id = id;
        this.opponentId = opponentId;
        this.week = week;
        this.totalPoints = totalPoints;
        this.opponentTotalPoints = opponentTotalPoints;
        this.win = win;
    }
}
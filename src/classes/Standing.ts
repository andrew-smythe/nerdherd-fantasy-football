import Team from "@/classes/Team";

export default class Standing {
    team: Team;
    wins: number;
    losses: number;
    totalPoints: number;

    constructor(team: Team, wins: number, losses: number, totalPoints: number) {
        this.team = team;
        this.wins = wins;
        this.losses = losses;
        this.totalPoints = totalPoints;
    }
 }
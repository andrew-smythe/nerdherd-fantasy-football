
export default class PlayerStats {
    name: string;
    team: string;
    opponent: string;
    playerPosition: string;
    rosterPositionId: number;
    passingYards: number;
    passingTds: number;
    passingInts: number;
    rushingYards: number;
    receivingYards: number;
    receivingTds: number;
    fumbles: number;
    twoPoints: number;
    pats: number;
    nineteenFgs: number;
    twentynineFgs: number;
    thirtynineFgs: number;
    fourtynineFgs: number;
    fiftyFgs: number;
    sacks: number;
    defenseInts: number;
    fumbleRecoveries: number;
    safeties: number;
    defenseTds: number;
    returnTds: number;
    pointsAllowed: number;
    totalPoints: number;
    gameUrl: string;
    source: string;

    constructor(
        name: string,
        team: string,
        opponent: string,
        playerPosition: string,
        rosterPositionId: number,
        passingYards: number | undefined,
        passingTds: number | undefined,
        passingInts: number | undefined,
        rushingYards: number | undefined,
        receivingYards: number | undefined,
        receivingTds: number | undefined,
        fumbles: number | undefined,
        twoPoints: number | undefined,
        pats: number | undefined,
        nineteenFgs: number | undefined,
        twentynineFgs: number | undefined,
        thirtynineFgs: number | undefined,
        fourtynineFgs: number | undefined,
        fiftyFgs: number | undefined,
        sacks: number | undefined,
        defenseInts: number | undefined,
        fumbleRecoveries: number | undefined,
        safeties: number | undefined,
        defenseTds: number | undefined,
        returnTds: number | undefined,
        pointsAllowed: number | undefined,
        totalPoints: number | undefined,
        gameUrl: string | undefined,
        source: string
    )
    {
        this.name = name;
        this.team = team;
        this.opponent = opponent;
        this.playerPosition = playerPosition;
        this.rosterPositionId = rosterPositionId;
        this.passingYards = passingYards ?? 0;
        this.passingTds = passingTds ?? 0;
        this.passingInts = passingInts ?? 0;
        this.rushingYards = rushingYards ?? 0;
        this.receivingYards = receivingYards ?? 0;
        this.receivingTds = receivingTds ?? 0;
        this.fumbles = fumbles ?? 0;
        this.twoPoints = twoPoints ?? 0;
        this.pats = pats ?? 0;
        this.nineteenFgs = nineteenFgs ?? 0;
        this.twentynineFgs = twentynineFgs ?? 0;
        this.thirtynineFgs = thirtynineFgs ?? 0;
        this.fourtynineFgs = fourtynineFgs ?? 0;
        this.fiftyFgs = fiftyFgs ?? 0;
        this.sacks = sacks ?? 0;
        this.defenseInts = defenseInts ?? 0;
        this.fumbleRecoveries = fumbleRecoveries ?? 0;
        this.safeties = safeties ?? 0;
        this.defenseTds = defenseTds ?? 0;
        this.returnTds = returnTds ?? 0;
        this.pointsAllowed = pointsAllowed ?? 0;
        this.totalPoints = totalPoints ?? 0;
        this.gameUrl = gameUrl ?? "";
        this.source = source;
    }
}
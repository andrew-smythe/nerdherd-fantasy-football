import { connect } from '@/db/utils/connect';
const { Op } = require('sequelize');

export default class LeagueSettings {
    readonly numRegSeasonWeeks : number;
    readonly numPlayoffWeeks : number;
    readonly numTeams : number;
    readonly numTeamsPlayoffs : number;
    readonly year : number;
    readonly source : 'nfl' | 'sleeper';
    readonly rosterPositions : any[];

    constructor(numRegSeasonWeeks: number, numPlayoffWeeks: number, numTeams: number, numTeamsPlayoffs: number, year: number, source: 'nfl' | 'sleeper', rosterPositions: any[]) {
        this.numRegSeasonWeeks = numRegSeasonWeeks;
        this.numPlayoffWeeks = numPlayoffWeeks;
        this.numTeams = numTeams;
        this.numTeamsPlayoffs = numTeamsPlayoffs;
        this.year = year;
        this.source = source;
        this.rosterPositions = rosterPositions;
    }

    static async loadYear(year: number) : Promise<LeagueSettings | undefined> {
        const db = connect();

        const ls = await db.leaguesettings.findOne(
            {
                where: {
                    year: year,
                },
            }
        );
        if (ls === null) {
            console.error('Could not load league settings for ' + year);
            return undefined;
        }

        const dbRosterPositions = await db.rosterpositions.findAll();
        const rosterPositions = dbRosterPositions.map(rp => {
            let position = '';
            if (rp.position === 'R/W/T') position = 'FLEX';
            else position = rp.position;

            return {
                id: rp.id,
                position: position,
            }
        });

        return new LeagueSettings(ls.numWeeksRegular, ls.numWeeksPlayoffs, ls.numTeams, ls.numTeamsPlayoffs, year, ls.source, rosterPositions);
    }
}
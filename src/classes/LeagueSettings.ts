import { connect } from '@/db/utils/connect';
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

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

        const dbRosterPositions = await db.leaguesettingspositions.findAll({
            where: {
                year: year
            },
            include: [{
                model: db.rosterpositions,
                as: 'rosterPosition',
            }],
            order: [[Sequelize.col('rosterPosition.order')]],
        });
        
        const rosterPositions = dbRosterPositions.map(rp => {
            let position = rp.rosterPosition.position;
            if (position === 'R/W/T') position = 'FLEX';
            return {
                rosterPositionId: rp.rosterPositionId,
                position: position,
                numSlots: rp.numSlots,
            }
        });

        db.sequelize.close();

        return new LeagueSettings(ls.numWeeksRegular, ls.numWeeksPlayoffs, ls.numTeams, ls.numTeamsPlayoffs, year, ls.source, rosterPositions);
    }

    static async loadAllYears() : Promise<LeagueSettings[]> {
        const db = connect();

        const rawLeagueSettings = await db.leaguesettings.findAll();
        const firstYear = Math.min(...rawLeagueSettings.map(ls => ls.year));
        const lastYear = Math.max(...rawLeagueSettings.map(ls => ls.year));

        const leagueSettings : LeagueSettings[] = [];
        for (let year = firstYear; year <= lastYear; year++) {
            leagueSettings.push((await LeagueSettings.loadYear(year))!);
        }

        db.sequelize.close();

        return leagueSettings;
    }
}
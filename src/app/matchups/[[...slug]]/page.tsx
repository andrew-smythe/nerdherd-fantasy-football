import * as React from 'react';
import LeagueSettings from '@/classes/LeagueSettings';
import Matchup from '@/classes/Matchup';
import Season from '@/classes/Season';
import MatchupFilters from '@/components/Matchup/MatchupsFilters';
import PlayerHeaderMini from '@/components/Matchup/PlayerHeaderMini';
import { Box, Divider, Grid, Paper } from '@mui/material';
import Text from '@mui/material/Typography';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {

    try {
        const { slug } = await params;
        const year = slug ? parseInt(slug[0]) : 2010;

        const allSeasons = await LeagueSettings.loadAllYears();
        const minYear = Math.min(...allSeasons.map(s => s.year));
        const maxYear = Math.max(...allSeasons.map(s => s.year));

        const season = await Season.fetchSeasonByYear(year);
        if (!season) throw new Error("COULD NOT LOAD SEASON " + year);

        const matchups = await season.getRegularSeasonMatchupSummaries();

        return (
            <>
                <MatchupFilters
                    minYear={minYear}
                    maxYear={maxYear}
                    year={year}
                ></MatchupFilters>
                <Paper sx={{ p: 2 }} variant="outlined">
                    <Text variant="h5" sx={{ textAlign: "center" }}>{ year } Regular Season Matchups</Text>
                    <Grid container spacing={2} sx={{ justifyContent: "center" }}>
                        {
                            matchups.map((week, i) => (
                                <React.Fragment key={"week"+i}>
                                    <Box component={Grid} size={12}>
                                        <Divider textAlign="center" sx={{ my: 1}}>
                                            <Text variant="button" sx={{ color: "text.secondary" }}>Week { i + 1 }</Text>
                                        </Divider>
                                    </Box>
                                    {
                                        week.map(matchup => (
                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={"matchup" + matchup.id}>
                                                <PlayerHeaderMini
                                                    team1Name={matchup.team1Name}
                                                    team2Name={matchup.team2Name}
                                                    team1Points={matchup.team1Points}
                                                    team2Points={matchup.team2Points}
                                                    team1UserId={matchup.team1UserId}
                                                    team2UserId={matchup.team2UserId}
                                                    team1Wins={matchup.team1Wins}
                                                    team2Wins={matchup.team2Wins}
                                                    team1Losses={matchup.team1Losses}
                                                    team2Losses={matchup.team2Losses}
                                                    bye={matchup.bye}
                                                    year={year}
                                                    week={matchup.week}
                                                ></PlayerHeaderMini>
                                            </Grid>
                                        ))
                                    }
                                </React.Fragment>
                            ))
                        }
                    </Grid>
                </Paper>
            </>
        );
    }
    catch(e: unknown) {
        if (e instanceof Error) {
            console.error(e.message);
            return (
                <div>ERROR - { e.message }</div>
            )
        }
        return (
            <div>ERROR - UNKNOWN</div>
        )
    }
}
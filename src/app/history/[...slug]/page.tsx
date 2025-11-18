import * as React from 'react';
import Playoff from '@/classes/Playoff';
import Season from '@/classes/Season';
import PlayerHeaderMini from '@/components/Matchup/PlayerHeaderMini';
import { Box, Card, CardActionArea, CardContent, Divider, Grid, List, ListItem, ListItemText } from '@mui/material';
import Text from '@mui/material/Typography';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: number }>
}) {

    try {
        const { slug } = await params;
        const year = slug[0];

        const season = await Season.fetchSeasonByYear(year);
        if (!season) throw new Error("COULD NOT LOAD " + year + " SEASON");
        
        const standings = await season.getRegularSeasonStandings();
        const playoffData : Playoff = await season.getPlayoffs();

        const playoffWeekSummaries : any = [];
        for (let i = 1; i <= playoffData.numWeeks; i++) {
            playoffWeekSummaries.push(await playoffData.getMatchupSummaryByWeek(i));
        }
        
        return (
            <Grid container spacing={2}>
                { /* Regular season */ }
                <Grid size={{ xs: 12, md: 6 }}>
                    <Text variant="h4" sx={{ textAlign: "center" }}>{ year } Regular Season</Text>
                    <Divider textAlign="center" sx={{ my: 1 }}>
                        <Text variant="button" sx={{ color: "text.secondary" }}>Standings</Text>
                    </Divider>
                    <List component={Card} variant="outlined">
                    { 
                        standings.map((s, i) => (
                            <React.Fragment key={"team"+i}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Grid container spacing={2}>
                                                <Grid size={8}>
                                                    <Text variant="body1" component="span">
                                                        #{ i+1 } { s.team.name } <Text component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>{ s.wins }-{ s.losses }</Text>
                                                    </Text>
                                                </Grid>
                                                <Grid size={4} sx={{ textAlign: "right" }}>
                                                    <Text variant="body2" component="span">
                                                        PF: { s.totalPoints.toFixed(2) }
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                        }
                                    />
                                </ListItem>
                                { i < standings.length - 1 ? <Divider component="li" /> : "" }
                            </React.Fragment>
                        )) 
                    }

                            { /*
                            <Card key={"team"+i} sx={{ mb: 1, pb: -3 }} variant="outlined">
                                <CardActionArea>
                                    <CardContent>
                                        <Text variant="subtitle1">#{ i+1 } { s.team.name } { s.wins }-{ s.losses } { s.totalPoints.toFixed(2) }</Text>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            */ }
                    </List>
                </Grid>
                { /* Playoffs */ }
                <Grid size={{ xs: 12, md: 6 }}>
                    <Text variant="h4" sx={{ textAlign: "center" }}>{ year } Playoffs</Text>
                    {
                        playoffWeekSummaries.map((week, i) => (
                            <Box key={"week"+i}>
                                <Divider textAlign="center" sx={{ my: 1 }}>
                                    <Text variant="button" sx={{ color: "text.secondary" }}>Round {i + 1} - Week { playoffData.startingWeek + i }</Text>
                                </Divider>
                                {
                                    week.map(matchup => (
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
                                            week={playoffData.startingWeek + i}
                                            key={"matchup" + matchup.id}
                                        ></PlayerHeaderMini>
                                    ))
                                }
                            </Box>
                        ))
                    }
                </Grid>
            </Grid>
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
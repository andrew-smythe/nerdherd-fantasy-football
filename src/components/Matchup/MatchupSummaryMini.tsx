'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Text from '@mui/material/Typography';
import WinnerIcon from '@mui/icons-material/EmojiEvents';
import Link from 'next/link';

function PlayerData({ name, points, wins, losses, winner, bye = false, route, sx}) {
    if (bye) {
        return (
            <CardActionArea component={Link} href={route} sx={sx}>
                <CardContent sx={{ py: 0 }}>
                    <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Grid size={12}>
                            <Text variant="subtitle1">Bye</Text>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        );
    }
    else {
        return (  
            <CardActionArea component={Link} href={route} sx={sx}>
                <CardContent sx={{ py: 0 }}>
                    <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Grid size={{ lg: 10, xs: 9 }}>
                            <Text variant="subtitle1">{ winner ? (<><WinnerIcon fontSize="inherit" sx={{ verticalAlign: "middle" }} /><span>&nbsp;</span></>) : "" }{ name } <Text component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>{ wins }-{ losses }</Text></Text>
                        </Grid>
                        <Grid size={{ lg: 2, xs: 3 }}>
                            <Text variant="subtitle2" sx={{ textAlign: 'right' }}>{ points?.toFixed(2) }</Text>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        );
    }
}

export default function MatchupSummaryMini({
    team1Name,
    team1Points,
    team1UserId,
    team1Wins,
    team1Losses,
    team2Name,
    team2Points,
    team2UserId,
    team2Wins,
    team2Losses,
    year,
    week,
    bye
}) {

    const team1Route = "/matchup/" + team1UserId + "/" + year + "/" + week;
    const team2Route = !bye ? "/matchup/" + team2UserId + "/" + year + "/" + week : team1Route
    const winner = (team1Points > team2Points) || bye ? 1 : 2;

    return (
        <Card variant="outlined" sx={{ mb: 1 }}>
            <PlayerData 
                name={team1Name}
                points={team1Points}
                wins={team1Wins}
                losses={team1Losses}
                winner={winner === 1}
                route={team1Route}
                sx={{ pt: 0.8 }}
            ></PlayerData>
            <PlayerData 
                name={team2Name}
                points={team2Points}
                wins={team2Wins}
                losses={team2Losses}
                winner={winner === 2}
                route={team2Route}
                bye={bye}
                sx={{ pb: 0.8 }}
            ></PlayerData>
        </Card>
    );
}
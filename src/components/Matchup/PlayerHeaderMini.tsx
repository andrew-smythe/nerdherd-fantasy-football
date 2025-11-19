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

function PlayerData({ team1Name, team1Points, team1Wins, team1Losses, team2Name, team2Points, team2Wins, team2Losses, bye }) {
    if (bye) {
        return (
                <>
                    <Grid size={{ lg: 10, xs: 9 }}>
                        <Text variant="subtitle1"><WinnerIcon fontSize="inherit" sx={{ verticalAlign: "middle" }} />&nbsp;{ team1Name } <Text component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>{ team1Wins }-{ team1Losses }</Text></Text>
                    </Grid>
                    <Grid size={{ lg: 2, xs: 3 }}>
                        <Text variant="subtitle2" sx={{ textAlign: 'right' }}>{ team1Points?.toFixed(2) }</Text>
                    </Grid>
                    <Grid size={12}>
                        <Text variant="subtitle1">Bye</Text>
                    </Grid>
                </>
        );
    }
    else {
        const win = team1Points > team2Points ? 1 : 2;
        return (
                <>
                    <Grid size={{ lg: 10, xs: 9 }}>
                        <Text variant="subtitle1">{ win == 1 ? (<><WinnerIcon fontSize="inherit" sx={{ verticalAlign: "middle" }} /><span>&nbsp;</span></>) : "" }{ team1Name } <Text component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>{ team1Wins }-{ team1Losses }</Text></Text>
                    </Grid>
                    <Grid size={{ lg: 2, xs: 3 }}>
                        <Text variant="subtitle2" sx={{ textAlign: 'right' }}>{ team1Points?.toFixed(2) }</Text>
                    </Grid>
                    <Grid size={{ lg: 10, xs: 9 }}>
                        <Text variant="subtitle1">{ win == 2 ? (<><WinnerIcon fontSize="inherit" sx={{ verticalAlign: "middle" }} /><span>&nbsp;</span></>) : "" }{ team2Name } <Text component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>{ team2Wins }-{ team2Losses }</Text></Text>
                    </Grid>
                    <Grid size={{ lg: 2, xs: 3 }}>
                        <Text variant="subtitle2" sx={{ textAlign: 'right' }}>{ team2Points.toFixed(2) }</Text>
                    </Grid>
                </>
        );
    }
}

export default function PlayerHeaderMini({
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

    const matchupRoute = "/matchup/" + team1UserId + "/" + year + "/" + week; 

    return (
        <Card variant="outlined" sx={{ mb: 1 }}>
            <CardActionArea component={Link} href={matchupRoute}>
                <CardContent sx={{ py: 0.8 }}>
                    <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <PlayerData 
                            team1Name={team1Name}
                            team1Points={team1Points}
                            team1Wins={team1Wins}
                            team1Losses={team1Losses}
                            team2Name={team2Name}
                            team2Points={team2Points}
                            team2Wins={team2Wins}
                            team2Losses={team2Losses}
                            bye={bye}
                        ></PlayerData>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
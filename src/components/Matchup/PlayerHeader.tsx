'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Text from '@mui/material/Typography';

function PlayerData({ teamName, userName, points, record, reverse }) {
    if (reverse) {
        return (
            <>
                <Grid size={{ lg: 2, xs: 5 }}>
                    <Text variant="h3">{ points.toFixed(2) }</Text>
                </Grid>
                <Grid size={{ lg: 10, xs: 7 }}>
                    <Text variant="h4" sx={{ textAlign: 'right' }}><Text component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>{ record.wins }-{ record.losses }</Text> { teamName }</Text>
                    <Text variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'right' }}>{ userName }</Text>
                </Grid>
            </>
        );
    }
    else {
        return (
            <>
                <Grid size={{ lg: 10, xs: 7 }}>
                    <Text variant="h4">{ teamName } <Text component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>{ record.wins }-{ record.losses }</Text></Text>
                    <Text variant="subtitle1" sx={{ color: 'text.secondary' }}>{ userName }</Text>
                </Grid>
                <Grid size={{ lg: 2, xs: 5 }}>
                    <Text variant="h3" sx={{ textAlign: 'right' }}>{ points.toFixed(2) }</Text>
                </Grid>
            </>
        )
    }
}

function PositionScores({ positions, positionSlots, reverse }) {
    const theme = useTheme();
    const fontSize = useMediaQuery(theme.breakpoints.up('sm')) ? 13 : 11;
    const positionScores: Array<any> = [];
    for (let i in positionSlots) {
        let points = 0;
        if (positions[i]) {
            points = positions[i].points;
        }
        positionScores.push(
            <Grid size={12 / positionSlots.length} key={i}>
                <Paper sx={{ padding: '2px' }} elevation={3}>
                    <Text variant="body1" sx={{ textAlign: 'center', fontSize: fontSize, fontWeight: 'bold' }}>{ positionSlots[i].position }</Text>
                    <Text variant="body2" sx={{ textAlign: 'center', fontSize: fontSize }}>{ points.toFixed(2) }</Text>
                </Paper>
            </Grid>
        );
    }
    
    if (reverse) {
        return (
            <Grid container spacing={0.5} sx={{ justifyContent: 'flex-start' }}>
                { positionScores }
            </Grid>
        )
    }
    else {
        return (
            <Grid container spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                { positionScores }
            </Grid>
        )
    }
}

export default function PlayerHeader({
        record,
        team,
        username,
        totalPoints,
        reverse = false,
        positions,
        positionSlots,
}) {
    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined">
                <CardContent>
                    <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <PlayerData teamName={team} userName={username} points={totalPoints} reverse={reverse} record={record}></PlayerData>
                    </Grid>
                    <PositionScores positions={positions} positionSlots={positionSlots} reverse={reverse}></PositionScores>
                </CardContent>
            </Paper>
        </Grid>
    );
}
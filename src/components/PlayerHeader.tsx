'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Text from '@mui/material/Typography';

function PlayerData({ teamName, userName, points, reverse }) {
    if (reverse) {
        return (
            <>
                <Grid size={{ xs: 2 }}>
                    <Text variant="h3">{ points.toFixed(2) }</Text>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <Text variant="h4" sx={{ textAlign: 'right' }}>{ teamName }</Text>
                    <Text variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'right' }}>{ userName }</Text>
                </Grid>
            </>
        );
    }
    else {
        return (
            <>
                <Grid size={{ xs: 6}}>
                    <Text variant="h4">{ teamName }</Text>
                    <Text variant="subtitle1" sx={{ color: 'text.secondary' }}>{ userName }</Text>
                </Grid>
                <Grid size={{ xs: 2}}>
                    <Text variant="h3" sx={{ textAlign: 'right' }}>{ points.toFixed(2) }</Text>
                </Grid>
            </>
        )
    }
}

function PositionScores({ positions, reverse }) {
    const positionScores: Array<any> = [];
    console.log('POSITIONS', positions);
    for (let i in positions) {
        positionScores.push(
            <Grid size={0.8} key={i}>
                <Paper sx={{ padding: '2px' }} elevation={3}>
                    <Text variant="body1" sx={{ textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{ positions[i].position }</Text>
                    <Text variant="body2" sx={{ textAlign: 'center', fontSize: 13 }}>{ positions[i].points }</Text>
                </Paper>
            </Grid>
        );
    }
    
    if (reverse) {
        return (
            <Grid container spacing={1} sx={{ justifyContent: 'flex-start' }}>
                { positionScores }
            </Grid>
        )
    }
    else {
        return (
            <Grid container spacing={1} sx={{ justifyContent: 'flex-end' }}>
                { positionScores }
            </Grid>
        )
    }
}

function PositionScore({ position }) {

}

export default function PlayerHeader({
        record,
        team,
        username,
        totalPoints,
        reverse = false,
        positions,    
}) {
    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined">
                <CardContent>
                    <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <PlayerData teamName={team} userName={username} points={totalPoints} reverse={reverse}></PlayerData>
                    </Grid>
                    <PositionScores positions={positions} reverse={reverse}></PositionScores>
                </CardContent>
            </Paper>
        </Grid>
    );
}
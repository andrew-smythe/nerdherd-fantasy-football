'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Text from '@mui/material/Typography';
import PlayerStats from '@/classes/PlayerStats';

function createStatsLine(playerStats) {
    let statsStr = "";
    if (playerStats.playerPosition == 'QB') {
        if (playerStats.passingYards) {
            statsStr += playerStats.passingYards + " Pass Yd, ";
        }
        if (playerStats.passingTds) {
            statsStr += playerStats.passingTds + " Pass TDs, ";
        }
        if (playerStats.passingInts) {
            statsStr += playerStats.passingInts + " INTs, ";
        }
        if (playerStats.rushingYards) {
            statsStr += playerStats.rushingYards + " Rush Yd, ";
        }
        if (playerStats.rushingTds) {
            statsStr += playerStats.rushingTds + " Rush TDs, ";
        }
        if (playerStats.twoPoints) {
            statsStr += playerStats.twoPoints + " 2-PT, ";
        }
        if (playerStats.fumbles) {
            statsStr += playerStats.fumbles + " FUM, ";
        }
    }
    else if (playerStats.playerPosition == 'RB' || playerStats.playerPosition == 'WR' || playerStats.playerPosition == 'TE') {
        if (playerStats.rushingYards) {
            statsStr += playerStats.rushingYards + " Rush Yd, ";
        }
        if (playerStats.rushingTds) {
            statsStr += playerStats.rushingTds + " Rush TDs, ";
        }
        if (playerStats.receivingYards) {
            statsStr += playerStats.receivingYards + " Rec Yd, ";
        }
        if (playerStats.receivingTds) {
            statsStr += playerStats.receivingTds + " Rec TDs, ";
        }
        if (playerStats.twoPoints) {
            statsStr += playerStats.twoPoints + " 2-PT, ";
        }
        if (playerStats.fumbles) {
            statsStr += playerStats.fumbles + " FUM, ";
        }
    }
    else if (playerStats.playerPosition == 'K') {
        if (playerStats.pats) {
            statsStr += playerStats.pats + " PATs, ";
        }
        if (playerStats.nineteenFgs) {
            statsStr += playerStats.nineteenFgs + " 0-19, ";
        }
        if (playerStats.twentynineFgs) {
            statsStr += playerStats.twentynineFgs + " 20-29, ";
        }
        if (playerStats.thirtynineFgs) {
            statsStr += playerStats.thirtynineFgs + " 30-39, ";
        }
        if (playerStats.fourtynineFgs) {
            statsStr += playerStats.fourtynineFgs + " 40-49, ";
        }
        if (playerStats.fiftyFgs) {
            statsStr += playerStats.fiftyFgs + " 50+, ";
        }
    }
    else if (playerStats.playerPosition == 'DEF') {
        if (playerStats.pointsAllowed) {
            statsStr += playerStats.pointsAllowed + " Pts Allowed, ";
        }
        if (playerStats.sacks) {
            statsStr += playerStats.sacks + " Sacks, ";
        }
        if (playerStats.defenseInts) {
            statsStr += playerStats.defenseInts + " INTs, ";
        }
        if (playerStats.fumbleRecoveries) {
            statsStr += playerStats.fumbleRecoveries + " FUM, ";
        }
        if (playerStats.safeties) {
            statsStr += playerStats.safeties + " SAFETY, ";
        }
        if (playerStats.defenseTds) {
            statsStr += playerStats.defenseTds + " Def TDs, ";
        }
        if (playerStats.returnTds) {
            statsStr += playerStats.returnTds + " Ret TDs, ";
        }
    }

    if (statsStr[statsStr.length - 1] == " " && statsStr[statsStr.length - 2] == ",") {
        statsStr = statsStr.slice(0, statsStr.length - 2);
    }
    return statsStr;
}

function PlayerData({
    playerStats,
    reverse = false
}) {
    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

    if (!reverse) {
        return (
            <Grid container sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Grid size={{ lg: 9, xs: 7 }}>
                    <Text variant="body1">{ playerStats.name }</Text>
                    <Text variant="body2">{ playerStats.playerPosition } - { playerStats.team }</Text>
                    { bigScreen ? <Text variant="body2">{ createStatsLine(playerStats) }</Text> : "" }
                </Grid>
                <Grid size={{ lg: 3, xs: 5 }}>
                    <Text sx={{ textAlign: 'right' }} variant="h5">{ playerStats.totalPoints }</Text>
                </Grid>
                { !bigScreen ?
                    <Grid size={12}>
                        <Text variant="body2">{ createStatsLine(playerStats) }</Text>
                    </Grid>
                  : ""
                }
            </Grid>
        );
    }

    return (
            <Grid container sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Grid size={{ lg: 3, xs: 5 }}>
                    <Text variant="h5">{ playerStats.totalPoints }</Text>
                </Grid>
                <Grid size={{ lg: 9, xs: 7 }}>
                    <Text variant="body1" sx={{ textAlign: 'right' }}>{ playerStats.name }</Text>
                    <Text variant="body2" sx={{ textAlign: 'right' }}>{ playerStats.playerPosition } - { playerStats.team }</Text>
                    { bigScreen ? <Text variant="body2" sx={{ textAlign: 'right' }}>{ createStatsLine(playerStats) }</Text> : "" }
                </Grid>
                { !bigScreen ?
                    <Grid size={12}>
                        <Text variant="body2" sx={{ textAlign: 'right' }}>{ createStatsLine(playerStats) }</Text>
                    </Grid>
                  : ""
                }
            </Grid>
    );
}

export default function PositionRow({
        position,
        playerStats,
        opponentPlayerStats,
}) {
    return (
        <>
            <Grid size={{ xl: 5.75, lg: 5.5, xs: 5.25 }} sx={{ alignSelf: "stretch" }}>
                <Paper variant="outlined" sx={{ p: 2, height: "100%" }} elevation={2}>
                    <PlayerData playerStats={playerStats}></PlayerData>
                </Paper>
            </Grid>
            <Grid size={{ xl: 0.5, lg: 1, xs: 1.5 }}>
                <Paper sx={{ pt: 2, pb: 2 }} elevation={5}>
                        <Text sx={{ textAlign: 'center' }} variant="body1">{ position }</Text>
                </Paper>
            </Grid>
            <Grid size={{ xl: 5.75, lg: 5.5, xs: 5.25 }} sx={{ alignSelf: "stretch" }}>
                <Paper variant="outlined" sx={{ p: 2, height: "100%" }} elevation={2}>
                    <PlayerData reverse playerStats={opponentPlayerStats}></PlayerData>
                </Paper>
            </Grid>
        </>
    );
}
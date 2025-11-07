import User from '@/classes/User';
import LeagueSettings from '@/classes/LeagueSettings';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Text from '@mui/material/Typography';
import PlayerStats from '@/classes/PlayerStats';
import PlayerHeader from '@/components/Matchup/PlayerHeader';
import PositionRow from '@/components/Matchup/PositionRow';

function getPositionPoints(playerStats: any[], settings: LeagueSettings) {
    let ret = playerStats
        .filter(md => md.rosterPositionId !== 8)
        .map(md => ({
            position: settings.rosterPositions.find(rp => rp.rosterPositionId === md.rosterPositionId)?.position,
            points: md.totalPoints,
        }));
    return ret;
}

function getPositionSlots(settings: LeagueSettings) {
    const positionSettings = settings.rosterPositions;
    const positionSlots : any[] = [];
    for (let pos of positionSettings) {
        for (let i = 0; i < pos.numSlots; i++) {
            if (pos.rosterPositionId !== 8) {
                positionSlots.push({
                    rosterPositionId: pos.rosterPositionId,
                    position: pos.position,
                });
            }
        }
    }
    return positionSlots;
}

function getBenchSlots(settings: LeagueSettings) {
    const positionSettings = settings.rosterPositions;
    const positionSlots : any[] = [];
    for (let pos of positionSettings) {
        for (let i = 0; i < pos.numSlots; i++) {
            if (pos.rosterPositionId === 8) {
                positionSlots.push({
                    rosterPositionId: pos.rosterPositionId,
                    position: pos.position,
                });
            }
        }
    }
    return positionSlots;
}

function getSlottedPlayers(players: PlayerStats[], slots: any[]) {
    let slottedPlayers: any = [];
    for (let s of slots) {
        let newPlayerIndex = players.findIndex(p => p.rosterPositionId == s.rosterPositionId);
        if (newPlayerIndex >= 0) {
            let newPlayer = players.splice(newPlayerIndex, 1)[0];
            slottedPlayers.push(newPlayer);
        }
        else {
            slottedPlayers.push({});
        }
    }
    return slottedPlayers;
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {

    try {
        const { slug } = await params;
        if (slug.length !== 3) throw new Error("INCORRECT NUMBER OF PARAMS");

        const userId = parseInt(slug[0]);
        const year = parseInt(slug[1]);
        const week = parseInt(slug[2]);
        if (isNaN(userId) || isNaN(year) || isNaN(week)) throw new Error("INCORRECT PARAM FORMATTING");

        const user = await User.fetchByUserId(userId);
        if (!user) throw new Error("COULD NOT FIND USER");

        const team = await user.getTeamByYear(year);
        if (!team) throw new Error("COULD NOT FIND TEAM");

        const matchupData = await team.getMatchupDataByWeek(week);
        if (!matchupData) throw new Error("COULD NOT FIND MATCHUP FOR WEEK " + week);

        const opponentUser = await User.fetchByTeamId(matchupData.opponentId);
        if (!opponentUser) throw new Error("COULD NOT FIND OPPONENT USER");

        const opponentTeam = await opponentUser.getTeamByYear(year);
        if (!opponentTeam) throw new Error("COULD NOT FIND OPPONENT TEAM");

        const opponentMatchupData = await opponentTeam.getMatchupDataByWeek(week);
        if (!opponentMatchupData) throw new Error("COULD NOT FIND OPPONENT MATCHUP FOR WEEK " + week);

        let totalPoints = matchupData.totalPoints();
        let opponentTotalPoints = opponentMatchupData.totalPoints();

        const settings = await LeagueSettings.loadYear(year);
        if (!settings) throw new Error("COULD NOT LOAD LEAGUE SETTINGS FOR YEAR " + year);

        const positionPoints: any = getPositionPoints(matchupData.playerStats, settings);
        const opponentPositionPoints: any = getPositionPoints(opponentMatchupData.playerStats, settings);

        const positions = settings.rosterPositions;
        const positionSlots = getPositionSlots(settings);
        const benchSlots = getBenchSlots(settings);

        const starters = getSlottedPlayers(matchupData.playerStats.filter(ps => ps.rosterPositionId !== 8), positionSlots);
        const bench = getSlottedPlayers(matchupData.playerStats.filter(ps => ps.rosterPositionId === 8), benchSlots);
        const opponentStarters = getSlottedPlayers(opponentMatchupData.playerStats.filter(ps => ps.rosterPositionId !== 8), positionSlots);
        const opponentBench = getSlottedPlayers(opponentMatchupData.playerStats.filter(ps => ps.rosterPositionId === 8), benchSlots);

        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <PlayerHeader
                        record={"6-2"}
                        team={team.name}
                        username={user.name}
                        totalPoints={totalPoints}
                        positions={positionPoints}
                        positionSlots={positionSlots}
                    ></PlayerHeader>
                    <PlayerHeader
                        record={"3-5"}
                        team={opponentTeam.name}
                        username={opponentUser.name}
                        totalPoints={opponentTotalPoints}
                        positions={opponentPositionPoints}
                        positionSlots={positionSlots}
                        reverse
                    ></PlayerHeader>
                </Grid>
                <Text variant="subtitle2" sx={{ textAlign: "center" }}>Starters</Text>
                <Grid container spacing={1} alignItems="center">
                    {
                        positionSlots.map((slot, i) => (
                            // NextJS gets unhappy when we pass complex objects to client components. To work around this,
                            // we shallow copy the complex PlayerStats object with JSON.parse(JSON.stringify(obj)) 
                            <PositionRow position={slot.position} playerStats={JSON.parse(JSON.stringify(starters[i]))} opponentPlayerStats={JSON.parse(JSON.stringify(opponentStarters[i]))} key={slot.position + i}></PositionRow>
                        ))
                    }
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Text variant="subtitle2" sx={{ textAlign: "center" }}>Bench</Text>
                <Grid container spacing={1} alignItems="center">
                    {
                        benchSlots.map((slot, i) => (
                            // NextJS gets unhappy when we pass complex objects to client components. To work around this,
                            // we shallow copy the complex PlayerStats object with JSON.parse(JSON.stringify(obj))
                            <PositionRow position={slot.position} playerStats={JSON.parse(JSON.stringify(bench[i]))} opponentPlayerStats={JSON.parse(JSON.stringify(opponentBench[i]))} key={slot.position + i}></PositionRow>
                        ))
                    }
                </Grid>
            </Box>
        );
    }
    catch(e: unknown) {
        if (e instanceof SyntaxError) {
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
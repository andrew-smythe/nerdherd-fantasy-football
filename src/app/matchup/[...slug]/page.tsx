import User from '@/classes/User';
import LeagueSettings from '@/classes/LeagueSettings';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Text from '@mui/material/Typography';
import MatchupStats from '@/classes/MatchupStats';
import PlayerHeader from '@/components/PlayerHeader';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {

    try {
        const { slug } = await params;
        if (slug.length !== 3) throw("INCORRECT NUMBER OF PARAMS");

        const userId = parseInt(slug[0]);
        const year = parseInt(slug[1]);
        const week = parseInt(slug[2]);
        if (isNaN(userId) || isNaN(year) || isNaN(week)) throw("INCORRECT PARAM FORMATTING");

        const user = await User.fetchByUserId(userId);
        if (!user) throw("COULD NOT FIND USER");

        const team = await user.getTeamByYear(year);
        if (!team) throw("COULD NOT FIND TEAM");

        const matchupData = await team.getMatchupDataByWeek(week);
        if (!matchupData) throw("COULD NOT FIND MATCHUP FOR WEEK " + week);

        const opponentUser = await User.fetchByTeamId(matchupData.opponentId);
        if (!opponentUser) throw ("COULD NOT FIND OPPONENT USER");

        const opponentTeam = await opponentUser.getTeamByYear(year);
        if (!opponentTeam) throw ("COULD NOT FIND OPPONENT TEAM");

        const opponentMatchupData = await opponentTeam.getMatchupDataByWeek(week);
        if (!opponentMatchupData) throw ("COULD NOT FIND OPPONENT MATCHUP FOR WEEK " + week);

        let totalPoints = matchupData.totalPoints();
        let opponentTotalPoints = opponentMatchupData.totalPoints();

        const settings = await LeagueSettings.loadYear(year);
        if (!settings) throw ("COULD NOT LOAD LEAGUE SETTINGS FOR YEAR " + year);
        console.log('=============SETTINGS', settings);

        const positionPoints: any = matchupData.playerStats
        .filter(md => md.rosterPositionId !== 8)
        .map(md => ({
            position: settings.rosterPositions.find(rp => rp.id === md.rosterPositionId)?.position,
            points: md.totalPoints,
        }));

        const opponentPositionPoints: any = opponentMatchupData.playerStats
        .filter(md => md.rosterPositionId !== 8)
        .map(md => ({
            position: settings.rosterPositions.find(rp => rp.id === md.rosterPositionId)?.position,
            points: md.totalPoints,
        }));

        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <PlayerHeader
                        record={"6-2"}
                        team={team.name}
                        username={user.name}
                        totalPoints={totalPoints}
                        positions={positionPoints}
                    ></PlayerHeader>
                    <PlayerHeader
                        record={"3-5"}
                        team={opponentTeam.name}
                        username={opponentUser.name}
                        totalPoints={opponentTotalPoints}
                        positions={opponentPositionPoints}
                        reverse
                    ></PlayerHeader>
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
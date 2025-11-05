
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Text from '@mui/material/Typography';

function sleep() {
    return new Promise(r => setTimeout(r, 50));
}

async function getDraftDataFromSleeper() {
    const sleeperApiUrl = "https://api.sleeper.app/v1/";
    const leagueId = "1253868614637858816";

    try {        
        // get all the users
        const usersUrl = sleeperApiUrl + "league/" + leagueId + "/users";
        const usersFetch = await fetch(usersUrl);
        if (!usersFetch.ok) {
            throw new Error("Could not fetch users: " + usersFetch.status);
        }

        // Get the fields we want
        const users = (await usersFetch.json()).map(u => ({name: u.display_name, id: u.user_id, pointsFor: 0, pointsAgainst: 0}));
        await sleep();

        // Get the rosters
        const rostersUrl = sleeperApiUrl + "league/" + leagueId + "/rosters";
        const rostersFetch = await fetch(rostersUrl);
        if (!rostersFetch.ok) {
            throw new Error("Could not fetch rosters: " + rostersFetch.status);
        }

        // only need user id and roster id
        const rosters = (await rostersFetch.json()).map(r => ({userId: r.owner_id, rosterId: r.roster_id}));
        for (let u of users) {
            u.rosterId = rosters.find(r => r.userId == u.id)?.rosterId;
        }
        await sleep();

        // figure out what week it is
        const nflStateUrl = sleeperApiUrl + "state/nfl";
        const nflFetch = await fetch(nflStateUrl);
        if (!nflFetch.ok) {
            throw new Error("Could not fetch nfl status: " + nflFetch.status);
        }

        const nfl = await nflFetch.json();
        const currentWeek = nfl.week;
        await sleep();

        // Get ALL THE MATCHUPS
        for (let i = 1; i <= currentWeek; i++) {
            const matchupsUrl = sleeperApiUrl + "league/" + leagueId + "/matchups/" + i;
            const matchupsFetch = await fetch(matchupsUrl);
            if (!matchupsFetch.ok) {
                throw new Error("Could not fetch matchups for week " + i + " " + matchupsFetch.status);
            }

            const matchups = await matchupsFetch.json();
            
            // calculate points for each player
            for (let u of users) {
                let matchup = matchups.find(m => m.roster_id == u.rosterId);
                if (matchup) {
                    u.pointsFor += matchup.points;
                    let matchupId = matchup.matchup_id;

                    // find opponent
                    let oppMatchup = matchups.find(m => m.matchup_id == matchupId && m.roster_id != u.rosterId);
                    if (oppMatchup) {
                        u.pointsAgainst += oppMatchup.points;
                    }
                }
                u.total = u.pointsFor + u.pointsAgainst;
            }

            await sleep();
        }

        users.sort((u1, u2) => u2.total - u1.total);
        let ret = users.map((u, i) => ({ position: i+1, ...u }));

        return ret;
    }
    catch (e: unknown) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        console.error('Some unknown error occurred');
    }
}

export default async function DraftDraft() {

    let users = await getDraftDataFromSleeper();

    return (
        <>
            <Text variant="h4" sx={{ mb: 2, textAlign: "center" }}>Draft Draft Order</Text>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Position</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Points For</TableCell>
                            <TableCell>Points Against</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map(u => (
                                <TableRow
                                    key={u.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                                >
                                    <TableCell component="th" scope="row">{ u.position }</TableCell>
                                    <TableCell>{ u.name }</TableCell>
                                    <TableCell>{ u.pointsFor.toFixed(2) }</TableCell>
                                    <TableCell>{ u.pointsAgainst.toFixed(2) }</TableCell>
                                    <TableCell>{ u.total.toFixed(2) }</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

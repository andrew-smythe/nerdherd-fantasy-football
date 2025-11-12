const util = require('util');
const mysql = require('mysql2');
const fs = require('fs');

makeDb = function (host, user, password, database) {
    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database,
    });

    return {
        query(sql, args) {
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    }
}

async function main() {
    try {
        let settings = JSON.parse(fs.readFileSync('../config.json'))
        const db = makeDb(settings.db.host, settings.db.user, settings.db.password, settings.db.database);

        console.log('Loading matchups from DB...');

        let matchups = await db.query('SELECT m.id, m.teamId, m.opponentId, t.name as name, t2.name as opponentName, m.week, t.year FROM `matchups` m LEFT JOIN `teams` t ON t.id = m.teamId LEFT JOIN `teams` t2 on t2.id = m.opponentId');
        if (matchups.length > 0) {
            for (let matchup of matchups) {
                if (matchup.opponentId != null) {
                    console.log('Updating matchup ' + matchup.name + ' vs ' + matchup.opponentName + ', week ' + matchup.week + ' of ' + matchup.year + '...');
                    const totalPointsQ = await db.query('SELECT SUM(totalPoints) as totalPoints FROM weeklyplayerstats WHERE rosterPositionId != 8 AND teamId = ' + matchup.teamId + ' AND week = ' + matchup.week);
                    if (totalPointsQ.length > 0) {
                        const totalPoints = totalPointsQ[0].totalPoints;
                        const opponentPointsQ = await db.query('SELECT SUM(totalPoints) as totalPoints FROM weeklyplayerstats WHERE rosterPositionId != 8 AND teamId = ' + matchup.opponentId + ' AND week = ' + matchup.week);
                        if (opponentPointsQ.length > 0) {
                            const opponentPoints = opponentPointsQ[0].totalPoints;
                            const winner = (totalPoints > opponentPoints) ? matchup.teamId : matchup.opponentId;

                            let result = await db.query('UPDATE matchups SET winner = ' + winner + ', totalPoints = ' + totalPoints + ', opponentTotalPoints = ' + opponentPoints + ' WHERE id = ' + matchup.id);
                            if (!result) {
                                console.error('ERROR: Could not update matchup ' + matchup.id);
                                break;
                            }
                        }
                    }
                }
            }
        }
        await db.close();
        console.log('Done.');
    }
    catch (e) {
        console.error('ERROR - Could not read config from config.json');
        console.error(e);
    }
}

main();
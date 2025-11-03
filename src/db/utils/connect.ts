const Sequelize = require('sequelize');
const fs = require('fs');
const initModels = require('@/db/models/init-models');

export function connect() {
    // load config from filesystem
    const config = JSON.parse(fs.readFileSync('config.json'));

    const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
        host: config.db.host,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
    });

    const models = initModels(sequelize);

    return models;
}
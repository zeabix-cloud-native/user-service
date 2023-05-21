const { Sequelize } = require('sequelize');
const User = require('../models/users.model');
const Org = require('../models/orgs.model');

const DB_HOST = process.env.DB_HOST || "127.0.0.1"
const DB_NAME = process.env.DB_NAME || "userDB"
const DB_USERNAME = process.env.DB_USERNAME || "user-service"
const DB_PASSWORD = process.env.DB_PASSWORD || "passw0rd"
const DB_DEBUG = process.env.DB_DEBUG && process.env.DB_DEBUG === 'true' || false

const DB_MAX_POOLSIZE = process.env.DB_MAX_POOLSIZE ? parseInt(process.env.DB_MAX_POOLSIZE) : 100

const sequelize = new Sequelize(
    DB_NAME, DB_USERNAME, DB_PASSWORD,
    {
      host: DB_HOST,
      dialect: 'mysql',
      logging: DB_DEBUG,
      pool: {
        max: DB_MAX_POOLSIZE,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

const connect = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const user = User.schemas(sequelize);
        const org = Org.schemas(sequelize);

        //await sequelize.sync({ force: true })
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
};

const disconnect = async () => {
    try {
        await sequelize.close();
        console.log(`Close database connection successfully`);
    } catch (error) {
        console.error(`Unable to closed database connection: `, error);
    }
}

module.exports = {
    sequelize,
    connect,
    disconnect
}
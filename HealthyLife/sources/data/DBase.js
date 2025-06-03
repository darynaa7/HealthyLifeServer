const express = require('express');
const {Sequelize} = require('sequelize');
const authRouter = require('../domain/authentification/AuthRouter')


const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/HealthyData', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: false,
    },
    logging: console.log
});

sequelize.authenticate().then(() => {
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;

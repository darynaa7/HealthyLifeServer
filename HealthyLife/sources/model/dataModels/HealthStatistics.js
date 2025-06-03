const {DataTypes} = require('sequelize');
const db = require('../../data/DBase');
const User = require('./User');

const HealthStatistics = db.define('UserDailySummary', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    caloriesAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    waterAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    carbsAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    proteinAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    fatsAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    fiberAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    timestamps: false
});

HealthStatistics.belongsTo(User, {foreignKey: 'userId'});

module.exports = HealthStatistics;
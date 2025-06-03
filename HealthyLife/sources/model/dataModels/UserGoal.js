const {DataTypes} = require('sequelize');
const db = require('../../data/DBase');
const User = require('./User');

const UserGoal = db.define('UserGoal', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    caloriesCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    waterCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    carbsCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    proteinCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    fatsCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    fiberCount: {
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

UserGoal.belongsTo(User, {foreignKey: 'userId'});
module.exports = UserGoal;
const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');
const User = require("./User");

const Friends = db.define('Friends', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    followerId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    followedId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
});

Friends.belongsTo(User, {foreignKey: 'followerId', as: 'followerUser'});
Friends.belongsTo(User, {foreignKey: 'followedId', as: 'followedUser'});

module.exports = Friends;
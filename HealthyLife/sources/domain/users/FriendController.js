const User = require('../../model/dataModels/User')
const ProfileFile = require('../../model/dataModels/ProfileFile')
const Friends = require('../../model/dataModels/Friends')
const {Op} = require("sequelize");
const {selectPage} = require("../../model/list/List");
const AuthManager = require("../authentification/AuthManager");

class FriendController {

    async searchFriends(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];

            if (!authorizationHeader) {
                return res.status(403).json({message: 'User not authorized, no token, no header'});
            }

            const token = authorizationHeader.split(' ')[1];

            const tokenCheckResult = await AuthManager.checkToken(req, res, token)

            if (tokenCheckResult != null) {
                return tokenCheckResult
            }

            const thisUser = await User.findOne({ where: { token } });

            if (!thisUser) {
                return res.status(404).json()
            }

            const searchText = req.query.searchText;
            const page = req.query.page;
            const perPage = req.query.perPage;

            const foundUsers = await User.findAll({
                where: {
                    username: {
                        [Op.like]: `%${searchText}%`,
                    },
                }
            });

            const userInfoList = await Promise.all(
                foundUsers.map(async user => {
                    const profileFile = await ProfileFile.findOne({
                        where: {
                            userId: user.id
                        }
                    })

                    const friend = await Friends.findOne({
                        where: {
                            followerId: thisUser.id,
                            followedId: user.id
                        }
                    })

                    return {
                        id: user.id,
                        name: user.username,
                        profileFileId: profileFile ? profileFile.fileId : "null",
                        isFollowed: friend != null
                    };
                })
            );

            const foundUsersPage = selectPage(userInfoList, page, perPage)

            console.log(foundUsersPage)

            return res.json(foundUsersPage);
        } catch (e) {
            console.log(e)
            res.status(400).json();
        }
    }

    async getInfo(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];

            if (!authorizationHeader) {
                return res.status(403).json({message: 'User not authorized, no token, no header'});
            }

            const token = authorizationHeader.split(' ')[1];

            const tokenCheckResult = await AuthManager.checkToken(req, res, token)

            if (tokenCheckResult != null) {
                return tokenCheckResult
            }

            const thisUser = await User.findOne({ where: { token } });

            if (!thisUser) {
                return res.status(404).json()
            }

            const userId = req.query.userId;

            const user = await User.findOne({
                where: {
                    id: userId
                }
            });

            const profileFile = await ProfileFile.findOne({
                where: {
                    userId: user.id
                }
            })

            const friend = await Friends.findOne({
                where: {
                    followerId: thisUser.id,
                    followedId: user.id
                }
            })

            console.log(`FRIEND ${thisUser.id}, ${user.id}, ${friend}`)

            return res.json({
                id: user.id,
                name: user.username,
                profileFileId: profileFile ? profileFile.fileId : "null",
                isFollowed: friend != null
            });
        } catch (e) {
            res.status(400).json();
        }
    }

    async follow(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];

            if (!authorizationHeader) {
                return res.status(403).json({message: 'User not authorized, no token, no header'});
            }

            const token = authorizationHeader.split(' ')[1];

            const tokenCheckResult = await AuthManager.checkToken(req, res, token)

            if (tokenCheckResult != null) {
                return tokenCheckResult
            }

            const thisUser = await User.findOne({ where: { token } });

            if (!thisUser) {
                return res.status(404).json()
            }

            const userId = req.query.userId;

            await Friends.create({
                followerId: thisUser.id,
                followedId: userId
            })

            return res.status(200).json();
        } catch (e) {
            console.log(e)
            res.status(400).json();
        }
    }

    async unfollow(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];

            if (!authorizationHeader) {
                return res.status(403).json({message: 'User not authorized, no token, no header'});
            }

            const token = authorizationHeader.split(' ')[1];

            const tokenCheckResult = await AuthManager.checkToken(req, res, token)

            if (tokenCheckResult != null) {
                return tokenCheckResult
            }

            const thisUser = await User.findOne({ where: { token } });

            if (!thisUser) {
                return res.status(404).json()
            }

            const userId = req.query.userId;

            await Friends.destroy({
                where: {
                    followerId: thisUser.id,
                    followedId: userId
                }
            })

            return res.status(200).json();
        } catch (e) {
            res.status(400).json();
        }
    }

    async getFollowed(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];

            if (!authorizationHeader) {
                return res.status(403).json({message: 'User not authorized, no token, no header'});
            }

            const token = authorizationHeader.split(' ')[1];

            const tokenCheckResult = await AuthManager.checkToken(req, res, token)

            if (tokenCheckResult != null) {
                return tokenCheckResult
            }

            const thisUser = await User.findOne({ where: { token } });

            if (!thisUser) {
                return res.status(404).json()
            }

            const followedFriends = await Friends.findAll({
                where: {
                    followerId: thisUser.id
                },
                include: [{
                    model: User,
                    as: 'followedUser',
                    foreignKey: 'followedId'
                }]
            })

            const foundUsers = await Promise.all(
                followedFriends.map(async user => {
                    const profileFile = await ProfileFile.findOne({
                        where: {
                            userId: user.followedUser.id
                        }
                    })

                    return {
                        id: user.followedUser.id,
                        name: user.followedUser.username,
                        profileFileId: profileFile ? profileFile.fileId : "null",
                        isFollowed: true
                    };
                })
            );

            return res.status(200).json(foundUsers);
        } catch (e) {
            res.status(400).json();
        }
    }
}

module.exports = new FriendController();
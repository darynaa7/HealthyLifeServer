const User = require("../../model/dataModels/User");
const UserGoals = require("../../model/dataModels/UserGoal");
const HealthStatistics = require("../../model/dataModels/HealthStatistics");
const AuthManager = require("../authentification/AuthManager");

class HealthDataController {

    async updateData(req, res) {
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

            const user = await User.findOne({where: {token}});

            if (!user) {
                return res.status(404).json()
            }

            user.age = req.query.age
            user.height = req.query.height
            user.weight = req.query.weight
            user.gender = req.query.gender
            user.lifestyle = req.query.lifestyle
            user.goal = req.query.goal

            user.save()

            return res.status(200).json();
        } catch (e) {
            res.status(400).json();
        }
    }

    async getStatistics(req, res) {
        try {
            const userId = req.query.userId
            const dateId = req.query.dateId

            const user = await User.findOne({ where: { id: userId } });

            const healthStatistics = await HealthStatistics.findOne({
                where: {
                    id: dateId + userId,
                    userId: user.id
                }
            })

            if (healthStatistics == null) {
                return res.status(404).json()
            } else {
                const statistics = {
                    id: dateId,
                    caloriesAmount: healthStatistics.caloriesAmount,
                    waterAmount: healthStatistics.waterAmount,
                    carbsAmount: healthStatistics.carbsAmount,
                    proteinAmount: healthStatistics.proteinAmount,
                    fatsAmount: healthStatistics.fatsAmount,
                    fiberAmount: healthStatistics.fiberAmount,
                    age: user.age,
                    height: user.height,
                    weight: user.weight,
                    gender: user.gender,
                    lifestyle: user.lifestyle,
                    goal: user.goal
                }

                console.log(statistics)

                return res.status(200).json(statistics)
            }
        } catch (e) {
            res.status(400).json();
        }
    }

    async updateStatistics(req, res) {
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

            const user = await User.findOne({ where: { token } });

            if (!user) {
                return res.status(404).json()
            }

            const statistics = req.body

            const healthStatistics = await HealthStatistics.findOne({
                where: {
                    id: statistics.dateId + user.id,
                    userId: user.id
                }
            })

            if (healthStatistics == null) {
                const newStatistics = {
                    id: statistics.dateId + user.id,
                    userId: user.id,
                    caloriesAmount: statistics.caloriesAmount,
                    waterAmount: statistics.waterAmount,
                    carbsAmount: statistics.carbsAmount,
                    proteinAmount: statistics.proteinAmount,
                    fatsAmount: statistics.fatsAmount,
                    fiberAmount: statistics.fiberAmount
                }

                HealthStatistics.create(newStatistics)
            } else {
                healthStatistics.caloriesAmount = statistics.caloriesAmount
                healthStatistics.waterAmount = statistics.waterAmount
                healthStatistics.carbsAmount = statistics.carbsAmount
                healthStatistics.proteinAmount = statistics.proteinAmount
                healthStatistics.fatsAmount = statistics.fatsAmount
                healthStatistics.fiberAmount = statistics.fiberAmount

                healthStatistics.save()
            }

            return res.status(200).json();
        } catch (e) {
            res.status(400).json();
        }
    }
}

module.exports = new HealthDataController();
const Exercise = require('../../model/dataModels/Exercise')
const { Op } = require("sequelize");
const { selectPage } = require("../../model/list/List");
const sea = require("node:sea");

class ExerciseController {

    async searchExercises(req, res) {
        try {
            const searchText = req.query.searchText;
            const page = req.query.page;
            const perPage = req.query.perPage;

            const foundExercises = await Exercise.findAll({
                where: {
                    name: {
                        [Op.like]: `%${searchText}%`
                    }
                }
            })

            const foundExercisesPage = selectPage(foundExercises, page, perPage)

            return res.json(foundExercisesPage);
        } catch (e) {
            res.status(400).json();
        }
    }
}

module.exports = new ExerciseController();
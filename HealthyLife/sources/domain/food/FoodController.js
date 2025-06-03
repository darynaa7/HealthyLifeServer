const Food = require('../../model/dataModels/Food')
const { Op } = require("sequelize");
const { selectPage } = require("../../model/list/List");
const sea = require("node:sea");

class FoodController {

    async searchFoods(req, res) {
        try {
            const searchText = req.query.searchText;
            const page = req.query.page;
            const perPage = req.query.perPage;

            const foundFoods = await Food.findAll({
                where: {
                    name: {
                        [Op.like]: `%${searchText}%`
                    }
                }
            })

            const foundFoodsPage = selectPage(foundFoods, page, perPage)

            return res.json(foundFoodsPage);
        } catch (e) {
            console.log(e)
            res.status(400).json();
        }
    }
}

module.exports = new FoodController();
const Router = require('express')
const router = new Router()
const controller = require('./FoodController')

router.get('/search', controller.searchFoods)

module.exports = router
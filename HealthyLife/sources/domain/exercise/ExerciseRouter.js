const Router = require('express')
const router = new Router()
const controller = require('./ExerciseController')

router.get('/search', controller.searchExercises)

module.exports = router
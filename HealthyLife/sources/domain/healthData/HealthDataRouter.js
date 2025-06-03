const Router = require('express')
const router = new Router()
const controller = require('./HealthDataController')

router.post('/updateData', controller.updateData)
router.get('/getStatistics', controller.getStatistics)
router.post('/updateStatistics', controller.updateStatistics)

module.exports = router
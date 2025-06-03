const Router = require('express')
const router = new Router()
const controller = require('./FriendController')

router.get('/search', controller.searchFriends)
router.get('/info', controller.getInfo)
router.post('/follow', controller.follow)
router.post('/unfollow', controller.unfollow)
router.get('/getFollowed', controller.getFollowed)

module.exports = router
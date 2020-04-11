const router = require('express').Router();
const viewsContoller = require('../controllers/viewsController');

const authController = require('../controllers/authController');

router.route('/').get(authController.isLoggedIn, viewsContoller.getDashboard);
router.route('/folder').get(authController.isLoggedIn, viewsContoller.getFolder);
router.route('/charts').get(authController.isLoggedIn, viewsContoller.getCharts);
router.route('/me').get(authController.isLoggedIn, viewsContoller.getMe);

router.route('/signup').get(viewsContoller.getSignup);
router.route('/login').get(viewsContoller.getLogin);

module.exports = router;
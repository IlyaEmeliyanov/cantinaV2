const router = require('express').Router();
const viewsContoller = require('../controllers/viewsController');

const authController = require('../controllers/authController');

router.route('/home').get(authController.isLoggedIn, viewsContoller.getDashboard);
router.route('/charts').get(authController.isLoggedIn, viewsContoller.getCharts);
router.route('/signup').get(viewsContoller.getSignup);
router.route('/login').get(viewsContoller.getLogin);

module.exports = router;
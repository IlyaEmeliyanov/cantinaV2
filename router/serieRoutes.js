const express = require('express');
const router = express.Router();

const serieController = require('../controllers/serieController');
const authController = require('../controllers/authController');

router.route('/').get(serieController.getSeries).post(authController.protect, serieController.postSerie);
router.route('/:id').get(serieController.getSerie).patch(serieController.updateSerie).delete(serieController.deleteSerie);

router.route('/getSerieByDate/:year/:month/:day').get(serieController.getSerieByDate);
router.route('/getMonthlyPlan/:year/:month').get(serieController.getMonthlyPlan);

module.exports = router;
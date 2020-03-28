const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/getMe/:id', authController.protect, authController.getMe);
router.delete('/deleteMe/:id', authController.protect, authController.deleteMe);

module.exports = router;
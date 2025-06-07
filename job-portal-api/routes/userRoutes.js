const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const controller = require('../controllers/UserController')

router.post('/register',controller.registerUser);
router.post('/login',controller.loginUser);

router.get('/profile', verifyToken, controller.getUserProfile);

router.put('/profile', verifyToken, controller.updateUserProfile);

module.exports = router;
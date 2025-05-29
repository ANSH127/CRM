const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const requireAuth = require('../middleware/requireAuth');

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/google-login', UserController.googleLogin);

router.get('/useranalytics', requireAuth, UserController.getUserAnalytics);



module.exports = router;
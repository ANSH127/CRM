const express = require('express');
const router = express.Router();
const UserAnalyticsController = require('../controllers/UserAnalyticsController');
const requireAuth = require('../middleware/requireAuth');


router.use(requireAuth);
router.get('/', requireAuth, UserAnalyticsController.getUserAnalytics);

module.exports = router;


const express = require('express');
const router = express.Router();
const CampaignController = require('../controllers/CampaignController');
const requireAuth = require('../middleware/requireAuth');


router.use(requireAuth);

router.post('/create', CampaignController.createCampaign);
router.post('/matched-customers-count', CampaignController.getMatchedCustomersCount);
router.get('/', CampaignController.getCampaigns);
router.get('/campaign-records/:id', CampaignController.fetchCampaignsRecord);

module.exports = router;


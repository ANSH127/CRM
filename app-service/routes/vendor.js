const express = require('express');
const router = express.Router();

const VendorController = require('../controllers/VendorController');


router.post('/send', VendorController.SimulateDelivery);
router.post('/delivery-response', VendorController.deliveryResponse);

module.exports = router;
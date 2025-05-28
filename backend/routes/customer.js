const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const requireAuth = require('../middleware/requireAuth');


router.use(requireAuth);

router.get('/', CustomerController.getCustomers);
router.post('/create', CustomerController.createCustomer);
router.post('/create_multiple', CustomerController.createMultipleCustomers);
router.post('/delete_multiple', CustomerController.deleteCustomers);


module.exports = router;



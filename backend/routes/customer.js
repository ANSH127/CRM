const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const requireAuth = require('../middleware/requireAuth');
const multer = require('multer');
const upload =  multer({ storage: multer.memoryStorage() });


router.use(requireAuth);

router.get('/', CustomerController.getCustomers);
router.post('/create', CustomerController.createCustomer);
router.post('/create_multiple',upload.single('file'),CustomerController.createMultipleCustomers);
router.post('/delete_multiple', CustomerController.deleteCustomers);


module.exports = router;



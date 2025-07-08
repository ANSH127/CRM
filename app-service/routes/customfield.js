const express= require('express');
const router = express.Router();
const CustomFieldController = require('../controllers/CustomFieldController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', CustomFieldController.getCustomFields);
router.post('/create-fields', CustomFieldController.createCustomField);
router.post('/update-fields', CustomFieldController.updateCustomField);

module.exports = router;
const express = require('express')
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {guardarPlan} = require('../controllers/settingsControllers');

router.post('/savePlans', checkRole(['admin']), guardarPlan);

module.exports = router;
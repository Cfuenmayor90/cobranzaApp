const express = require('express')
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {guardarPlan, cargarSettins, deletePlan} = require('../controllers/settingsControllers');


router.get('/', checkRole(['admin']), cargarSettins);

router.post('/savePlans', checkRole(['admin']), guardarPlan);

router.get('/deletePlan/:id', checkRole(['admin']), deletePlan);

module.exports = router;
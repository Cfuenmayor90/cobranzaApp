const express = require('express')
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {guardarPlan, cargarSettins, deletePlan, updateValores, guardarValores} = require('../controllers/settingsControllers');


router.get('/', checkRole(['admin']), cargarSettins);

router.post('/savePlans', checkRole(['admin']), guardarPlan);

router.get('/deletePlan/:id', checkRole(['admin']), deletePlan);

router.post('/guardar', checkRole(['admin']), guardarValores);

router.post('/updateValores/:id', checkRole(['admin']), updateValores);

module.exports = router;
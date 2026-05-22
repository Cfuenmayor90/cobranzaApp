const express = require('express')
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {guardarPlan, cargarSettins, deletePlan, updateValores, guardarValores, createCreditCard, deleteCreditCard} = require('../controllers/settingsControllers');
const { create } = require('hbs');
const { createCheckSchema } = require('express-validator/src/middlewares/schema');


router.get('/', checkRole(['admin']), cargarSettins);

router.post('/savePlans', checkRole(['admin']), guardarPlan);

router.get('/deletePlan/:id', checkRole(['admin']), deletePlan);

router.post('/guardar', checkRole(['admin']), guardarValores);

router.post('/updateValores/:id', checkRole(['admin']), updateValores);

router.post('/createCreditCard', checkRole(['admin']), createCreditCard);
    
router.get('/deleteCreditCard/:id', checkRole(['admin']), deleteCreditCard);

module.exports = router;
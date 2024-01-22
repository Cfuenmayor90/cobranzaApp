const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {cotizarPlan, cargarVentas, guardarVentas} = require('../controllers/ventasControllers');


router.get('/', checkRole(['admin']), cargarVentas);

router.post('/cotizar', checkRole(['admin']), cotizarPlan);
router.post('/guardar', checkRole(['admin']), guardarVentas);

module.exports = router;
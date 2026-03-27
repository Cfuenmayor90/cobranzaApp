const express = require('express');
const router = express.Router();
const {cargarCalculadora, calcular, presupuestoProdCant, presupuestoProdFinal} = require('../controllers/calculadoraControllers');
const {checkRole} = require('../controllers/usersControllers');

router.get('/', checkRole(['admin', 'vendedor', 'cobrador', 'pisoDeVenta', 'supervisor']), cargarCalculadora);
router.post('/calcular', checkRole(['admin', 'cobrador', 'pisoDeVenta', 'supervisor', 'vendedor']), calcular);

router.post('/presupuestoProdCant', checkRole(['admin', 'cobrador', 'pisoDeVenta', 'supervisor', 'vendedor']), presupuestoProdCant);
router.post('/presupuestoProdFinal', checkRole(['admin', 'cobrador', 'pisoDeVenta', 'supervisor', 'vendedor']), presupuestoProdFinal);
module.exports = router;
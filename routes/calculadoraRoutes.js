const express = require('express');
const router = express.Router();
const {cargarCalculadora, calcular} = require('../controllers/calculadoraControllers');
const {checkRole} = require('../controllers/usersControllers');

router.get('/', checkRole(['admin', 'vendedor', 'cobrador', 'pisoDeVenta']), cargarCalculadora);
router.post('/calcular', checkRole(['admin', 'cobrador', 'pisoDeVenta']), calcular);
module.exports = router;
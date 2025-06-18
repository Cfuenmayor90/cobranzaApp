const express = require('express');
const router = express.Router();
const {cargarCalculadora, calcular} = require('../controllers/calculadoraControllers');
const {checkRole} = require('../controllers/usersControllers');

router.get('/', checkRole(['admin', 'vendedor', 'cobrador']), cargarCalculadora);
router.post('/calcular', checkRole(['admin', 'vendedor', 'cobrador']), calcular);
module.exports = router;
const express = require('express');
const { checkRole } = require('../controllers/usersControllers');
const router = express.Router();
const {cargarCobranza, pagoSave, listaPagos} = require('../controllers/cobranzaControllers');

router.get('/', checkRole(['cobrador']), cargarCobranza);

router.post('/savePago', checkRole(['cobrador']), pagoSave);

router.get('/pagosList/:id', checkRole(['cobrador']), listaPagos);

module.exports = router;
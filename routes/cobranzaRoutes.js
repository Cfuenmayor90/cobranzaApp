const express = require('express');
const { checkRole } = require('../controllers/usersControllers');
const router = express.Router();
const {cargarCobranza, pagoSave, listaPagos, listaPagosDiarios} = require('../controllers/cobranzaControllers');
const {timeOp} = require("../middleware/timeOpe");

router.get('/', checkRole(['cobrador']), cargarCobranza);

router.post('/savePago', checkRole(['cobrador']), timeOp,  pagoSave);

router.get('/pagosList/:id', checkRole(['cobrador']), listaPagos);

router.get('/pagoListDiario', checkRole(['cobrador']), listaPagosDiarios);

module.exports = router;
const express = require('express');
const { checkRole } = require('../controllers/usersControllers');
const router = express.Router();
const {cargarCobranza, pagoSave, listaPagos, listaPagosDiarios, envioTicket, refinanciarPres, saveRefinanciarPres, esperadoDiario} = require('../controllers/cobranzaControllers');
const {timeOp} = require("../middleware/timeOpe");

router.get('/', checkRole(['cobrador']), cargarCobranza);

router.post('/savePago', checkRole(['cobrador']), timeOp,  pagoSave);

router.get('/pagosList/:id', checkRole(['cobrador', 'admin']), listaPagos);

router.get('/pagoListDiario/:coRu', checkRole(['cobrador', 'admin']), listaPagosDiarios);

router.get('/ticket/:id', envioTicket);

router.get('/refinanciar/:id', checkRole(['admin']), refinanciarPres);

router.post('/saveRefinanciar', checkRole(['admin']), saveRefinanciarPres);

router.get('/generarBalance', checkRole(['admin']), esperadoDiario);

module.exports = router;
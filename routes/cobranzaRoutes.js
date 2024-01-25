const express = require('express');
const { checkRole } = require('../controllers/usersControllers');
const router = express.Router();
const {cargarCobranza, pagoSave} = require('../controllers/cobranzaControllers');

router.get('/', checkRole(['cobrador']), cargarCobranza);
router.post('/savePago', checkRole(['cobrador']), pagoSave);

module.exports = router;
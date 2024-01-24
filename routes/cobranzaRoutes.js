const express = require('express');
const { checkRole } = require('../controllers/usersControllers');
const router = express.Router();
const {cargarCobranza} = require('../controllers/cobranzaControllers');

router.get('/', checkRole(['cobrador']), cargarCobranza);

module.exports = router;
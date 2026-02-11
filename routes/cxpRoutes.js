const express = require('express');
const router = express.Router();

const { cargarCxp, saveCxp, saveOpeCxp} = require('../controllers/cuentasPorPagarControllers');

router.get('/', cargarCxp);

router.post('/crearCxp', saveCxp);

router.post('/saveOpeCxp', saveOpeCxp);

module.exports = router;     
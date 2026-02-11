const express = require('express');
const router = express.Router();
const { checkRole } = require("../controllers/usersControllers");

const { cargarCxp, saveCxp, saveOpeCxp} = require('../controllers/cuentasPorPagarControllers');

router.get('/', checkRole('admin'), cargarCxp);

router.post('/crearCxp',checkRole('admin'), saveCxp);

router.post('/saveOpeCxp',checkRole('admin'), saveOpeCxp);

module.exports = router;     
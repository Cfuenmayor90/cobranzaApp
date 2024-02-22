const express = require('express');
const router = express.Router();
const { checkRole } = require('../controllers/usersControllers');
const {cargarGeneral, guardarCaja, cargarPrestamosRuta, editCliente} = require('../controllers/generalControllers');

router.get('/', checkRole(['admin']), cargarGeneral);
router.post('/cajaOperacion', checkRole(['admin']), guardarCaja);
router.get('/cargarPres/:nRuta', checkRole(['admin']), cargarPrestamosRuta);
router.get('/editCliente/:dni', checkRole(['admin']), editCliente);

module.exports = router;
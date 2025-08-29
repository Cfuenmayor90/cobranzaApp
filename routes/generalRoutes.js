const express = require('express');
const router = express.Router();
const { checkRole } = require('../controllers/usersControllers');
const {cargarGeneral, guardarCaja, cargarPrestamosRuta, editCliente, cargarEstadisticas, deleteCajaOpe, load, cargarEstadoClient} = require('../controllers/generalControllers');

router.get('/', checkRole(['admin']), cargarGeneral);
router.post('/cajaOperacion', checkRole(['admin']), guardarCaja);
router.get('/deleteCajaOperacion/:_id', checkRole(['admin']), deleteCajaOpe);
router.get('/cargarPres/:nRuta', checkRole(['admin']), cargarPrestamosRuta);
router.get('/statusPresClient/:dni', checkRole(['admin', 'pisoDeVenta']), cargarEstadoClient);
router.get('/editCliente/:dni', checkRole(['admin']), editCliente);
router.get('/estadisticaUser/:nRuta', checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta']), cargarEstadisticas);
router.post('/estadisticaUserFecha', checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta']), cargarEstadisticas);

module.exports = router;
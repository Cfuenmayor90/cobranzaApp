const express = require('express');
const router = express.Router();
const { checkRole } = require('../controllers/usersControllers');
const {cargarGeneral, cargarGeneralSuper, guardarCaja, cargarPrestamosRuta, editCliente, cargarEstadisticas, hojaParaImprimir, deleteCajaOpe, load, cargarEstadoClient} = require('../controllers/generalControllers');

router.get('/', checkRole(['admin']), cargarGeneral);
router.get('/super', checkRole(['supervisor']), cargarGeneralSuper);
router.get('/hojaImprimir/:nRuta', checkRole(['admin', 'supervisor', 'pisoDeVenta']), hojaParaImprimir);
router.post('/cajaOperacion', checkRole(['admin']), guardarCaja);
router.get('/deleteCajaOperacion/:_id', checkRole(['admin']), deleteCajaOpe);
router.get('/cargarPres/:nRuta', checkRole(['admin', 'supervisor']), cargarPrestamosRuta);
router.get('/statusPresClient/:dni', checkRole(['admin', 'pisoDeVenta', 'supervisor']), cargarEstadoClient);
router.get('/editCliente/:dni', checkRole(['admin', 'supervisor']), editCliente);
router.get('/estadisticaUser/:nRuta', checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta', 'supervisor']), cargarEstadisticas);
router.post('/estadisticaUserFecha', checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta', 'supervisor']), cargarEstadisticas);

module.exports = router;
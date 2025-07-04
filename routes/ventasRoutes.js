const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {timeOp} = require('../middleware/timeOpe');
const {cotizarPlan, cargarVentas, guardarVentas, cargarVenCob, cotizarContado, guardarVentasContado} = require('../controllers/ventasControllers');


router.get('/', checkRole(['admin', 'pisoDeVenta']), cargarVentas);

router.post('/cotizar', checkRole(['admin', 'pisoDeVenta']), cotizarPlan);
router.post('/cotizarContado', checkRole(['admin', 'pisoDeVenta']), cotizarContado);
router.post('/guardar', checkRole(['admin', 'pisoDeVenta']), guardarVentas);
router.post('/guardarContado', checkRole(['admin', 'pisoDeVenta']), guardarVentasContado);
router.get('/listaVenCob/:nRuta', checkRole(['admin', 'cobrador', 'vendedor']), cargarVenCob);

module.exports = router;
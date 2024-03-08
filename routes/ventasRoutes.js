const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {timeOp} = require('../middleware/timeOpe');
const {cotizarPlan, cargarVentas, guardarVentas, cargarVenCob} = require('../controllers/ventasControllers');


router.get('/', checkRole(['admin']), cargarVentas);

router.post('/cotizar', checkRole(['admin']), timeOp, cotizarPlan);
router.post('/guardar', checkRole(['admin']),timeOp, guardarVentas);
router.get('/listaVenCob/:nRuta', checkRole(['admin', 'cobrador', 'vendedor']), cargarVenCob);

module.exports = router;
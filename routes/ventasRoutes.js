const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {timeOp} = require('../middleware/timeOpe');
const {cotizarPlan, cargarVentas, guardarVentas, cargarVenCob} = require('../controllers/ventasControllers');


router.get('/', checkRole(['admin']), cargarVentas);

router.post('/cotizar', checkRole(['admin']), cotizarPlan);
router.post('/guardar', checkRole(['admin']), guardarVentas);
router.get('/listaVenCob/:nRuta', checkRole(['admin', 'cobrador', 'vendedor']), cargarVenCob);

module.exports = router;
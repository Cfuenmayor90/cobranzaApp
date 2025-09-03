const express = require('express');
const router = express.Router();
const {cargarAlertas, eliminarTodos, eliminarUno} = require('../controllers/alertasControllers');
const {checkRole} = require('../controllers/usersControllers');

router.get('/', checkRole(['admin', 'pisoDeVenta', 'supervisor']), cargarAlertas);

router.get('/eliminarTodos/:id', checkRole(['admin', 'pisoDeVenta']), eliminarTodos);

router.get('/eliminarUno/:id', checkRole(['admin', 'supervisor']), eliminarUno);

module.exports = router;
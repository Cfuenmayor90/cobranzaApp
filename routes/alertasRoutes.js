const express = require('express');
const router = express.Router();
const {cargarAlertas, eliminarTodos, eliminarUno} = require('../controllers/alertasControllers');
const {checkRole} = require('../controllers/usersControllers');

router.get('/', checkRole(['admin']), cargarAlertas);

router.get('/eliminarTodos/:id', checkRole(['admin']), eliminarTodos);

router.get('/eliminarUno/:id', checkRole(['admin']), eliminarUno);

module.exports = router;
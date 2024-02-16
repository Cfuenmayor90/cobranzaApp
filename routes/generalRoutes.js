const express = require('express');
const router = express.Router();
const { checkRole } = require('../controllers/usersControllers');
const {cargarGeneral, guardarCaja} = require('../controllers/generalControllers');

router.get('/', checkRole(['admin']), cargarGeneral);

router.post('/cajaOperacion', checkRole(['admin']), guardarCaja);

module.exports = router;
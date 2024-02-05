const express = require('express');
const router = express.Router();
const { checkRole } = require('../controllers/usersControllers');
const {cargarGeneral} = require('../controllers/generalControllers');

router.get('/', checkRole(['admin']), cargarGeneral);

module.exports = router;
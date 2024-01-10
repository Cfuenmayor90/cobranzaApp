const express = require('express');
const router = express.Router();
const {
   crearCliente,
   editClientGet,
   editClientPost,
   deleteClient,
   buscarCliente
} = require('../controllers/clientControllers');
const {checkRole} = require('../controllers/usersControllers');

router.post('/crearCliente', crearCliente);

router.get('/edit/:id',checkRole(['admin']), editClientGet);
 
router.post('/edit/:id', checkRole(['admin']), editClientPost);

router.get('/delete/:id', checkRole(['admin']), deleteClient);

router.post('/buscar', checkRole(['admin', 'cobrador', 'vendedor']), buscarCliente);


module.exports = router;
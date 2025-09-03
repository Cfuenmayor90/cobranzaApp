const express = require('express');
const router = express.Router();
const {
   crearCliente,
   editClientGet,
   editClientPost,
   deleteClient,
   buscarCliente,
   listClient,
   noteClient,
   saveNoteClient
} = require('../controllers/clientControllers');
const {checkRole} = require('../controllers/usersControllers');

router.post('/crearCliente',checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta', 'supervisor']), crearCliente);

router.get('/edit/:id',checkRole(['admin', 'pisoDeVenta', 'supervisor']), editClientGet);
 
router.post('/edit/:id', checkRole(['admin', 'pisoDeVenta', 'supervisor']), editClientPost);

router.get('/delete/:id', checkRole(['admin']), deleteClient);

router.post('/buscar', checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta', 'supervisor']), buscarCliente);

router.get('/listClient', checkRole(['admin', 'pisoDeVenta', 'supervisor']), listClient);

router.get("/noteClient/:id", checkRole(["admin", 'pisoDeVenta', 'supervisor']), noteClient);

router.post("/saveNoteClient/:id", checkRole(["admin", 'pisoDeVenta', 'supervisor']), saveNoteClient);
module.exports = router;
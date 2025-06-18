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

router.post('/crearCliente',checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta']), crearCliente);

router.get('/edit/:id',checkRole(['admin', 'pisoDeVenta']), editClientGet);
 
router.post('/edit/:id', checkRole(['admin', 'pisoDeVenta']), editClientPost);

router.get('/delete/:id', checkRole(['admin']), deleteClient);

router.post('/buscar', checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta']), buscarCliente);

router.get('/listClient', checkRole(['admin', 'pisoDeVenta']), listClient);

router.get("/noteClient/:id", checkRole(["admin", 'pisoDeVenta']), noteClient);

router.post("/saveNoteClient/:id", checkRole(["admin", 'pisoDeVenta']), saveNoteClient);
module.exports = router;
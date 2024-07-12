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

router.post('/crearCliente',checkRole(['admin', 'cobrador', 'vendedor']), crearCliente);

router.get('/edit/:id',checkRole(['admin']), editClientGet);
 
router.post('/edit/:id', checkRole(['admin']), editClientPost);

router.get('/delete/:id', checkRole(['admin']), deleteClient);

router.post('/buscar', checkRole(['admin', 'cobrador', 'vendedor']), buscarCliente);

router.get('/listClient', checkRole(['admin']), listClient);

router.get("/noteClient/:id", checkRole(["admin"]), noteClient);

router.post("/saveNoteClient/:id", checkRole(["admin"]), saveNoteClient);
module.exports = router;
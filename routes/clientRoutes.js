const express = require('express');
const router = express.Router();
const {
   crearCliente,
   editClientGet,
   editClientPost,
   deleteClient
} = require('../controllers/clientControllers');
const {checkRole} = require('../controllers/usersControllers');
router.get('/', (req, res) => {
   res.send('lista de clientes');
});
router.post('/crearCliente', crearCliente);

router.get('/edit/:id',checkRole(['admin']), editClientGet);
 
router.post('/edit/:id', checkRole(['admin']), editClientPost);

router.get('/delete/:id', checkRole(['admin']), deleteClient);


module.exports = router;
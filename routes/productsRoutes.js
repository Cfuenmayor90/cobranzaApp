const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {cargarProducts, cargarPagProductos, upload, saveProducts, cotizarProd, filtrarProd, prodEditGet, prodEditSave} = require('../controllers/productControllers');

router.get('/productosUsuarios', cargarPagProductos);
router.get('/productos', checkRole(['admin']), cargarProducts);
router.get('/filtrarProd/:categoria', filtrarProd);
 
router.post('/saveProduct', checkRole(['admin']), upload, saveProducts);

router.get('/cotizarProd/:_id', cotizarProd);

router.get('/prodEdit/:_id', checkRole(['admin']), prodEditGet);

router.post('/prodEditSave/:id', checkRole(['admin']), upload, prodEditSave);

module.exports = router;
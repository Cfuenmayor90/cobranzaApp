const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {cargarProducts, imprimirProd, cargarPagProductos, upload, saveProducts, cotizarProd, filtrarProd, prodEditGet, prodEditSave, prodDelete} = require('../controllers/productControllers');

router.get('/productosUsuarios', cargarPagProductos);

router.get('/productos', checkRole(['admin']), cargarProducts);

router.get('/imprimirProd', checkRole(['admin']), imprimirProd);

router.get('/filtrarProd/:categoria', filtrarProd);
 
router.post('/saveProduct', checkRole(['admin']), upload, saveProducts);

router.get('/cotizarProd/:id', cotizarProd);

router.get('/prodEdit/:_id', checkRole(['admin']), prodEditGet);

router.post('/prodEditSave/:id', checkRole(['admin']), upload, prodEditSave);

router.get('/delete/:id', checkRole(['admin']), prodDelete);

module.exports = router;
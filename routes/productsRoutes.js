const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {cargarProducts, cargarPagProductos, upload, saveProducts, cotizarProd, filtrarProd} = require('../controllers/productControllers');

router.get('/productosUsuarios', cargarPagProductos);
router.get('/productos', checkRole(['admin']), cargarProducts);
router.get('/filtrarProd/:categoria', filtrarProd);
 
router.post('/saveProduct', checkRole(['admin']), upload, saveProducts);

router.get('/cotizarProd/:id', cotizarProd);

module.exports = router;
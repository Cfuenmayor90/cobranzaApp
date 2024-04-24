const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {cargarProducts, cargarPagProductos, upload, saveProducts, cotizarProd} = require('../controllers/productControllers');

router.get('/productosUsuarios', checkRole(['admin', 'cobrador', 'vendedor']), cargarPagProductos);
router.get('/productos', checkRole(['admin']), cargarProducts)
 
router.post('/saveProduct', checkRole(['admin']), upload, saveProducts);

router.get('/cotizarProd/:id', cotizarProd);

module.exports = router;
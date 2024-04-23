const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {cargarProducts, cargarPagProductos, upload, saveProducts} = require('../controllers/productControllers');

router.get('/productosUsuarios', checkRole(['admin', 'cobrador', 'vendedor']), cargarPagProductos);
router.get('/productos', checkRole(['admin']), cargarProducts)
 
router.post('/saveProduct', checkRole(['admin']), upload, saveProducts);


module.exports = router;
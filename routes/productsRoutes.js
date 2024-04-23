const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {cargarProducts, upload, saveProducts} = require('../controllers/productControllers');

router.get('/productos', checkRole(['admin']), cargarProducts);
router.get('/productosUsuarios', checkRole(['admin', 'cobrador', 'vendedor']),cargarProducts);
 
 
router.post('/saveProduct', checkRole(['admin']), upload, saveProducts);


module.exports = router;
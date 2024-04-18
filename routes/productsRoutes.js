const express = require('express');
const router = express.Router();
const {checkRole} = require('../controllers/usersControllers');
const {cargarProducts} = require('../controllers/productControllers');

router.get('/productos', checkRole(['admin']), (req, res)=>{
    res.render('productos')
});
router.get('/productosUsuarios', checkRole(['admin', 'cobrador', 'vendedor']),cargarProducts);


module.exports = router;
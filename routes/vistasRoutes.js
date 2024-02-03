const express = require('express');
const router = express.Router();
const { validarIngresoUsuario,
    crearUsuario,
    checkRole,
    logOut,
volverPrin,
cargarUsuarios} = require('../controllers/usersControllers');
const  {cargarClientes} = require('../controllers/clientControllers');
const {cargarEstadisticas} = require('../controllers/estadisticasControllers');

router.get('/principal', checkRole(['admin']), (req, res)=>{
    res.render('principal')
});
router.get('/principalCobrador', checkRole(['cobrador']), (req, res)=>{
    res.render('principalCobrador')
});
router.get('/principalVendedor', checkRole(['vendedor']), (req, res)=>{
    res.render('principalVendedor')
});
router.get('/clientes', checkRole(['admin', 'cobrador', 'vendedor']), cargarClientes);

router.get('/cobranza', checkRole(['cobrador']), (req, res) =>{
    res.render('cobranza')
});
router.get('/RutasDeCobranza', checkRole(['admin']), (req, res)=>{
    res.render('rutasCobranza')
});
router.get('/productos', checkRole(['admin']), (req, res)=>{
    res.render('productos')
});
router.get('/estadisticas', checkRole(['admin',  'vendedor', 'cobrador']), cargarEstadisticas);
router.get('/novedades', checkRole(['admin',  'vendedor', 'cobrador']), (req, res)=>{
    res.render('novedades')
});

router.get('/usuarios', checkRole(['admin']), cargarUsuarios);

router.get('/gastos', checkRole(['admin',  'vendedor', 'cobrador']), (req, res)=>{
    res.render('gastos')
});

router.get('/Exit', logOut);

router.get('/volver', volverPrin)
module.exports = router;
const express = require('express');
const router = express.Router();
const { validarIngresoUsuario,
    crearUsuario,
    checkRole,
    logOut,
volverPrin,
cargarUsuarios} = require('../controllers/usersControllers');
const  {cargarClientes} = require('../controllers/clientControllers');
const {cargarEstadisticas, cargarCajaCobrador} = require('../controllers/estadisticasControllers');

router.get('/principal', checkRole(['admin']), (req, res)=>{
    res.render('principal')
});
router.get('/principalCobrador', checkRole(['cobrador']), (req, res)=>{
    res.render('principalCobrador')
});
router.get('/principalVendedor', checkRole(['vendedor']), (req, res)=>{
    res.render('principalVendedor')
});
router.get('/principalPiso', checkRole(['pisoDeVenta']), (req, res)=>{
    res.render('pisoDeVenta')
});
router.get('/clientes', checkRole(['admin', 'cobrador', 'vendedor', 'pisoDeVenta']), cargarClientes);

router.get('/cobranza', checkRole(['cobrador']), (req, res) =>{
    res.render('cobranza')
});
router.get('/RutasDeCobranza', checkRole(['admin']), (req, res)=>{
    res.render('rutasCobranza')
});

router.get('/estadisticas/:numRuta', checkRole(['admin',  'vendedor', 'cobrador', 'pisoDeVenta']), cargarEstadisticas);

router.get('/estadisticasTime', checkRole(['cobrador']), )

router.get('/novedades', checkRole(['admin',  'vendedor', 'cobrador']), (req, res)=>{
    res.render('novedades')
});

router.get('/usuarios', checkRole(['admin']), cargarUsuarios);

router.get('/caja/:cobRuta', checkRole(['admin',  'vendedor', 'cobrador']), cargarCajaCobrador);

router.get('/Exit', logOut);

router.get('/volver', checkRole(['admin',  'vendedor', 'cobrador', 'pisoDeVenta']), volverPrin);
module.exports = router;
const users = require("../models/userModels");
const ventas = require("../models/ventasModels");
const pagoN = require("../models/pagosModels");
const { generarJWT, verifyJWT } = require("../middleware/jwt");
const balances = require('../models/balanceModels');
const f = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2
});

const cargarEstadisticas = async (req, res) => {
    const token = req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    const today = new Date("2024-03-01");
    console.log(today);
    //{ cobRuta: verifyToken.numRuta, categoria: "balance_diario"}
    const balance = await balances.find({cobRuta: verifyToken.numRuta, categoria: 'balance_diario'});
    var cobradoT = 0;
    var esperadoT = 0;
    balance.forEach(element => {
      cobradoT = element.cobrado + cobradoT;
      esperadoT = element.esperado + esperadoT;
    });
    const porcentaje = parseInt((cobradoT / esperadoT)*100);
    cobradoT = f.format(cobradoT);
    esperadoT = f.format(esperadoT);
    res.render('estadisticas', {balance, cobradoT, esperadoT, porcentaje});
  
  };

  module.exports = {cargarEstadisticas};
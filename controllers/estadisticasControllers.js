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
    var anio = new Date().getFullYear();
     var mes = new Date().getMonth();
     var cantDias = new Date(anio, (mes+1), 0).getDate();
    const balance = await balances.find({cobRuta: verifyToken.numRuta, categoria: 'balance_diario', timeStamp:{$gte: new Date(anio,mes,0), $lt: new Date(anio,mes,cantDias)}});
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
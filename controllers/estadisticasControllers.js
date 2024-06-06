const users = require("../models/userModels");
const ventas = require("../models/ventasModels");
const pagoN = require("../models/pagosModels");
const caja = require("../models/cajaModels");
const hVentas = require("../models/historyVentas");
const { generarJWT, verifyJWT } = require("../middleware/jwt");
const balances = require('../models/balanceModels');
const f = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2
});

const cargarEstadisticas = async (req, res) => {

    var arrayAnios = [{anio:2024}, { anio:2025}, { anio: 2026}, { anio: 2027}, { anio:2028}, { anio:2029}, { anio:2030}]; 
    var {numRuta} = req.params;
    const {numRutaInp, mesInp, anioInp} = req.body;
    console.log(`numRuta ${numRutaInp} mes ${mesInp} año ${anioInp}`);
    var anio = anioInp || new Date().getFullYear();
     var mes = mesInp || new Date().getMonth();
     var cantDias = (new Date(anio, (mes+1), 0).getDate());
     cantDias = cantDias + 1;
     var numR = numRutaInp || numRuta;
     console.log("fechaForm " + anio);
    const balance = await balances.find({cobRuta: numR, categoria: 'balance_diario', timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}});
    const hisVent = await hVentas.find({venRuta: numR, timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}});
    const opeCaja = await caja.find({userCod: numR, timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}}).sort({timeStamp: -1});
    const cajaGastos = await caja.find({userCod: numR, tipo: "sueldos", timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}});
    var cobradoT = 0;
    var esperadoT = 0;
    var gastoT = 0;
    balance.forEach(element => {
      cobradoT = element.cobrado + cobradoT;
      esperadoT = element.esperado + esperadoT;
    });
    cajaGastos.forEach(element => {
      gastoT = element.monto + gastoT;
    });
    const porcentaje = parseInt((cobradoT / esperadoT)*100);
    cobradoT = f.format(cobradoT);
    esperadoT = f.format(esperadoT);
    gastoT = f.format(gastoT);
    res.render('estadisticas', {balance, cobradoT, esperadoT, porcentaje, hisVent, opeCaja, numR, gastoT, arrayAnios});
  };

  const cargarCajaCobrador = async(req, res) =>{
    const {cobRuta} = req.params;
    var anio = new Date().getFullYear();
    var mes = new Date().getMonth();
    var cantDias = new Date(anio, (mes+1), 0).getDate();
    const cajaOpe = await caja.find({userCod: cobRuta, tipo: ["sueldos", "rendicion"], timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}});
    const cajaGastos = await caja.find({userCod: cobRuta, tipo: "sueldos", timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}});
    const balance = await balances.find({cobRuta: cobRuta, categoria: 'balance_diario', timeStamp:{$gte: new Date(anio,mes,1), $lt: new Date(anio,mes,cantDias)}});
    var cobradoT = 0;
    var esperadoT = 0;
    var operaT = 0;
    var gastoT = 0;
    balance.forEach(element => {
      cobradoT = element.cobrado + cobradoT;
      esperadoT = element.esperado + esperadoT;
    });
     cajaOpe.forEach(element => {
       operaT = element.monto + operaT;
    });
    cajaGastos.forEach(element => {
      gastoT = element.monto + gastoT;
    });
    var porcentaje = parseInt((cobradoT / esperadoT)*100);
    var efectivo = cobradoT - operaT;
    efectivo = f.format(efectivo);
    gastoT = f.format(gastoT);
    cobradoT = f.format(cobradoT);
    esperadoT = f.format(esperadoT);
    console.log(cajaOpe);
    res.render('cajaCobrador', {cajaOpe, cobradoT, esperadoT, porcentaje, efectivo, gastoT});
  }
  module.exports = {cargarEstadisticas, cargarCajaCobrador};
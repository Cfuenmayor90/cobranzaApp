const users = require("../models/userModels");
const client = require("../models/clientModels");
const setPrest = require("../models/settingsModels");
const ventas = require("../models/ventasModels");
const pagoN = require("../models/pagosModels");
const { generarJWT, verifyJWT } = require("../middleware/jwt");
const balances = require('../models/balanceModels');
const dayjs = require('dayjs');
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const advanced = require("dayjs/plugin/advancedFormat");

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)
dayjs().tz('America/Buenos_Aires').format('DD/MM/YYYY z')

const cargarCobranza = async (req, res) => {
  const token = req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
  const verifyToken = await verifyJWT(token);
  const prestamos = await ventas.find({ cobRuta: verifyToken.numRuta}).sort({fechaUltPago: 1});
  var dia = "dia";
  const diaDat = dayjs().day();
  
  console.log("dia cobranza " + diaDat);
  switch (diaDat) {
    case 1 :
       dia = "lunes";
      break;
    case 2 :
         dia = "martes";
      break;
    case 3 :
     dia = "miercoles";
      break;
    case 4 :
     dia = "jueves";
      break;
    case 5 :
      dia = "viernes" ;
      break;
    case 6 :
      dia = "sabado";
      break;
    default:
        dia = "domingo";
      break;
  }
  const diaD = [dia, 'todos'];
  const coRu = verifyToken.numRuta;
  const esperado = await ventas.find({ cobRuta: coRu, diaDeCobro: diaD});
  const diaInici = new Date().toLocaleString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});

  const hora = dayjs();
  console.log("hora: " + hora);
  const pagosActuales = await pagoN.find({cobRuta: coRu, fecha: diaInici});
  var monCobrado = 0;
  var espeValor = 0;
  var infoPagos = [];
  for (let i = 0; i < pagosActuales.length; i++) {
    const element = pagosActuales[i];
    monCobrado = element.pago + monCobrado;
    const infoPres = await ventas.findOne({_id:element.codPres});
    infoPagos.push({nombre: infoPres.nombre, pago:element.pago})
  };
  esperado.forEach(element => {
      espeValor = element.cuota +espeValor;
  });
  monCobrado = monCobrado.toFixed(2);
  espeValor = espeValor.toFixed(2);
  const efect = ((monCobrado / espeValor)*100).toFixed(2);
  res.render("cobranza", { prestamos, espeValor,monCobrado, dia, efect, infoPagos, hora});
};
const pagoSave = async (req, res) => {
  const { codPres, pago } = req.body;
  try {
    var fechaActual = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    console.log(fechaActual);
    const prestamo = await ventas.findById({ _id: codPres });
    if (prestamo.mTotal > pago && fechaActual !== prestamo.fechaUltPago) {
      const pagoVa = new pagoN(req.body);
      pagoVa.fecha = fechaActual;
      pagoVa.cobRuta = prestamo.cobRuta;
      await pagoVa.save();
      prestamo.mTotal = prestamo.mTotal - pago;
      prestamo.fechaUltPago = fechaActual;
      await ventas.findByIdAndUpdate({ _id: codPres }, prestamo);
      res.redirect('/cobranza');
    } else {
      const mensajeError = "¡No puedes ingresar 2 o mas pagos para el mismo credito en un mismo dia, el monto del pago debe ser menor al saldo!";
      res.render("error", { mensajeError });
    }
  } catch (error) {
    res.render("error");
  }
};
const listaPagos = async (req, res) => {
  try {
    const { id } = req.params;
    const listPa = await pagoN.find({ codPres: id });
    const prestamo = await ventas.findOne({ _id: id });
    console.log(prestamo);
    const array = [];
    listPa.forEach((element) => {
      const fechaString = element.fecha;
      const id = element._id;
      const pagO = element.pago;
      array.push({ fechaString, id, pagO });
    });
  
    return res.render("pagosList", { array, prestamo });
  } catch (error) {}
};
//funcion para guardar los balances diarios
const guardarBalanceDiario = async() =>{
  try {
    var fechaAc = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const buscarBalances = await balances.findOne({fecha: fechaAc});
    console.log("node cron cobranza");
    const diA = new Date().getDay("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    if (diA !==0 && !buscarBalances) {
      const ruCobro = await users.find({role:"cobrador"});
      var dia = "dia";
  switch (diA) {
    case 1 :
       dia = "lunes";
      break;
    case 2 :
         dia = "martes";
      break;
    case 3 :
     dia = "miercoles";
      break;
    case 4 :
     dia = "jueves";
      break;
    case 5 :
      dia = "viernes" ;
      break;
    case 6 :
      dia = "sabado";
      break;
    default:
        dia = "domingo";
      break;
  }
  const diaD = [dia, 'todos'];
    
     for (let i = 0; i < ruCobro.length; i++) {
        const element = ruCobro[i];
        var nRuta = element.numRuta;
        var pagos = await pagoN.find({cobRuta: nRuta, fecha: fechaAc});
        var esperado = await ventas.find({ cobRuta: nRuta, diaDeCobro: diaD});
        var pagosT = 0;
        var espeT = 0;
        pagos.forEach(element => {
          pagosT = element.pago + pagosT;
        });
        esperado.forEach(element => {
          espeT = element.cuota + espeT;
        });
        console.log("cron pagos totales:" + pagosT.toFixed(2));
        console.log("cron esperado total:" + espeT.toFixed(2));
        const balanceNew = new balances({cobRuta: nRuta, fecha: fechaAc, nombre: element.nombre, cobrado: pagosT.toFixed(2), esperado: espeT.toFixed(2) });
        await balanceNew.save();
        console.log(balanceNew);
      };  
    }
    
  } catch (error) {
    
  }
};

module.exports = { cargarCobranza, pagoSave, listaPagos, guardarBalanceDiario };

const users = require("../models/userModels");
const client = require("../models/clientModels");
const setPrest = require("../models/settingsModels");
const ventas = require("../models/ventasModels");
const pagoN = require("../models/pagosModels");
const { generarJWT, verifyJWT } = require("../middleware/jwt");
const balances = require('../models/balanceModels');
const f = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 1
});


const cargarCobranza = async (req, res) => {
  try {
    const token = req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    const prestamos = await ventas.find({ cobRuta: verifyToken.numRuta}).sort({fechaUltPago: 1});
    
    const coRu = verifyToken.numRuta;
    const diaInici = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const timeInici = new Date().toLocaleTimeString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const espe = await balances.findOne({ cobRuta:coRu, fecha:diaInici, categoria:"esperado"});
    const pagosActuales = await pagoN.find({cobRuta:coRu, fecha: diaInici});
    var monCobrado = 0;
   var espeValor = espe.esperado;
    var infoPagos = [];
    for (let i = 0; i < pagosActuales.length; i++) {
      const element = pagosActuales[i];
      monCobrado = element.pago + monCobrado;
      const infoPres = await ventas.findOne({_id:element.codPres});
      infoPagos.push({nombre: infoPres.nombre, pago:element.pago});
    };
    const efect = ((monCobrado / espeValor)*100).toFixed(2);
    espeValor = f.format(espeValor);
    monCobrado = f.format(monCobrado);
    res.render("cobranza", { prestamos, espeValor,monCobrado, efect, infoPagos,diaInici, timeInici});
    
  } catch (error) {
    
  }
};
const pagoSave = async (req, res) => {
  const { codPres, pago } = req.body;
  try {
    var fechaActual = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    console.log(fechaActual);
    const prestamo = await ventas.findById({ _id: codPres });
    if (prestamo.mTotal >= pago && fechaActual !== prestamo.fechaUltPago) {
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
const listaPagosDiarios = async(req, res) =>{
  try {
    const token = req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    const coRu = verifyToken.numRuta;
    const diaInici = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const pagosActuales = await pagoN.find({cobRuta:coRu, fecha: diaInici});
    var monCobrado = 0;
    var infoPagos = [];
    for (let i = 0; i < pagosActuales.length; i++) {
      const element = pagosActuales[i];
      monCobrado = element.pago + monCobrado;
      const infoPres = await ventas.findOne({_id:element.codPres});
      infoPagos.push({nombre: infoPres.nombre, pago:element.pago});
    };
    monCobrado = monCobrado.toFixed(2);
    res.render("pagosListDiarios", { monCobrado, infoPagos});
    
  } catch (error) {
    
  }
}
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
//funcion para guardar el esperado diario
const esperadoDiario = async(req, res) =>{
     try {
      var fechaAc = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
      const buscarEsperado = await balances.findOne({fecha: fechaAc, categoria: "esperado"});
      const diA = new Date().getDay();
      if (diA !==0 && !buscarEsperado) {
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
      var esperado = await ventas.find({ cobRuta: nRuta, diaDeCobro: diaD});
      var espeT = 0;
      esperado.forEach(element => {
        espeT = element.cuota + espeT;
      });
      console.log("cron esperado total:" + espeT.toFixed(2));
      const balanceNew = new balances({cobRuta: nRuta, fecha: fechaAc, nombre: element.nombre, esperado: espeT.toFixed(2), categoria: "esperado" });
      await balanceNew.save();
      console.log(balanceNew);
    };  
  }
  
     } catch (error) {
      
     }
};
//funcion para guardar los balances diarios
const guardarBalanceDiario = async() =>{
  try {
    var fechaAc = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const buscarBalances = await balances.findOne({fecha: fechaAc, categoria: 'balance_diario'});
    console.log("node cron cobranza"+ buscarBalances);
    const diA = new Date().getDay();
    if (diA !==0 && !buscarBalances) {
      const ruCobro = await users.find({role:"cobrador"});
      var dia = "dia";
      console.log("node cron cobranza if ok");
  
     for (let i = 0; i < ruCobro.length; i++) {
        const element = ruCobro[i];
        var nRuta = element.numRuta;
        var pagos = await pagoN.find({cobRuta: nRuta, fecha: fechaAc});
        var esperad = await balances.findOne({ cobRuta: nRuta, fecha: fechaAc, categoria: "esperado"});
        var venTas = await ventas.find({cobRuta: nRuta, fecha: fechaAc});
        var pagosT = 0;
        var venTotal = 0;
        var monTotal = 0;
        var ganan = 0;
        venTas.forEach(element => {
          venTotal = element.monto + venTotal;
          monTotal = element.mTotal + monTotal;
        });
        pagos.forEach(element => {
          pagosT = element.pago + pagosT;
        });
        ganan = (monTotal-venTotal).toFixed(2);
        const balanceNew = new balances({cobRuta: nRuta, fecha: fechaAc, nombre: element.nombre, cobrado: pagosT.toFixed(2), esperado: esperad.esperado.toFixed(2), categoria: "balance_diario", ventas: venTotal, ganancia: ganan });
        await balanceNew.save();
      };  
    }
    
  } catch (error) {
    
  }
};

module.exports = { cargarCobranza, pagoSave, listaPagos, listaPagosDiarios, guardarBalanceDiario, esperadoDiario };

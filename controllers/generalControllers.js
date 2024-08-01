const users = require("../models/userModels");
const ventas = require('../models/ventasModels');
const hVentas = require('../models/historyVentas');
const pagoN = require('../models/pagosModels');
const balances = require('../models/balanceModels');
const caja = require('../models/cajaModels');
const client = require("../models/clientModels");
const cron = require('node-cron');
const {verifyJWT} = require('../middleware/jwt');
const {guardarBalanceDiario, esperadoDiario, balanceDelete} = require('./cobranzaControllers');
const f = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
});

const load = (res, next) => {
  res.render('load');
  next();
}
const cargarGeneral = async(req, res) => {
  try {
    const usuario = await users.find({role: "cobrador"});
    var anio = new Date().getFullYear();
    var mes = new Date().getMonth();
    var cantDias = new Date(anio, (mes+1), 0).getDate();
        cantDias = cantDias + 1;
    const prest = await ventas.find();
    //ventas totales general desde su inicio
    const venTotalT = await balances.find({categoria:"balance_diario"});
    //ventas totales mensuales
    const ventasTo = await balances.find({categoria: "balance_diario",timeStamp:{$gte:new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}});
    const cajaList = await caja.find({timeStamp:{$gte:new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}}).sort({timeStamp: -1});
    const cajaListGastos = await caja.find({timeStamp:{$gte:new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}, tipo: ["gasto", "sueldos"]});
    const efeCajaTotal = await caja.find({tipo: ["rendicion", "inversion", "sueldos"]});
    var cajaGastos = await caja.find({tipo: ["sueldos", "gasto"]})
    const inversion = await caja.find({tipo: ["inversion", "ingreso"]});
    var porCobrar = 0;
    var venTotalTo = 0;
    var venTotal = 0; //ventas totales en el mes
    var ganaTotal = 0; //ganacias totales de todas las rutas
    var cobraTotal= 0; //cobrado total de todas las rutas
    var espeTotal = 0; //esperado total de todas las rutas
    var invT = 0; //inversiones totales
    var efeCajaT =0; // Efectivo total de caja
    var gasCaja = 0; // gastos de caja general
    var gastocajaMes = 0; // gastos de caja mes actual
    //sumamos todas las ventas en general desde el inicio
    venTotalT.forEach(element => {
      venTotalTo = element.ventas + venTotalTo;
    });
    cajaListGastos.forEach(element => {
      gastocajaMes = element.monto + gastocajaMes;
    });
    //sumamos todas las ventas y ganacias totales de las rutas en el MES  en curso
    ventasTo.forEach(element => {
      venTotal = element.ventas + venTotal;
      ganaTotal = element.ganancia + ganaTotal;
      cobraTotal = element.cobrado + cobraTotal;
      espeTotal = element.esperado + espeTotal;
    });
    inversion.forEach(element => {
      invT = element.monto + invT;
    });
    efeCajaTotal.forEach(element => {
      efeCajaT = element.monto + efeCajaT;
    });
    cajaGastos.forEach(element => {
      gasCaja = element.monto + gasCaja;
    });
    const vent = await ventas.find({timeStamp:{$gte:new Date(anio,mes,0), $lte: new Date(anio,mes,cantDias)}});
       prest.forEach(element => {
           porCobrar = element.mTotal + porCobrar;
        });
        const ArrayUserGene = [];
        // creamos el array de con los datos de cada ruta
        for (let i = 0; i < usuario.length; i++) {
            const element = usuario [i];
            var espeT = 0;
            var cobT = 0;
            var venT = 0;
            var ganaT =0;
            var gastoT = 0;
            var porCobrarT = 0;
            var mCaja = 0;
            var mAdelantos = 0;
            var efeCaja = 0;
            var cajaRendicion = await caja.find({userCod: element.numRuta,  timeStamp:{$gte:new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}, tipo: "rendicion"});
            var cajaAdelanto = await caja.find({userCod: element.numRuta,  timeStamp:{$gte:new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}, tipo: "sueldos"});
          
            var prestT = await ventas.find({cobRuta: element.numRuta});
            var balan = await balances.find({cobRuta: element.numRuta, timeStamp:{$gte:new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}, categoria: 'balance_diario'});
            cajaRendicion.forEach(element => {
              mCaja = element.monto + mCaja;
            });
            cajaAdelanto.forEach(element => {
              mAdelantos = element.monto + mAdelantos;
            });
          
            balan.forEach(element => {
              espeT = element.esperado + espeT;
              cobT = element.cobrado + cobT;
              venT = element.ventas + venT;
              ganaT = element.ganancia + ganaT;
       
            });
            prestT.forEach(element => {
              porCobrarT = element.mTotal + porCobrarT;
            });
            const efectividad = ((cobT/espeT)*100).toFixed(2);
                efeCaja = cobT  - (mCaja + mAdelantos); 
                efeCaja = f.format(efeCaja);
                espeT = f.format(espeT);
                cobT = f.format(cobT);
                venT = f.format(venT);
                ganaT = f.format(ganaT);
                gastoT = f.format(gastoT);
                porCobrarT = f.format(porCobrarT);
                mAdelantos = f.format(mAdelantos);
                const cPres = prestT.length;
                ArrayUserGene.push({espeT, cobT, venT, ganaT, gastoT, nombre: element.nombre, nRuta: element.numRuta, efectividad, porCobrarT, cPres, mCaja, mAdelantos, efeCaja});
        } //finaliza el for de usuarios

        efeCajaT = efeCajaT - venTotalTo - gasCaja;
         var capital = porCobrar + efeCajaT;
         var cantPres = prest.length;
         var gananCobTotal = cobraTotal * 0.35;
         invT = f.format(invT);
         var porcentajeT = ((cobraTotal/espeTotal)*100).toFixed(2);
         porCobrar = f.format(porCobrar);
          ganaTotal = f.format(ganaTotal);
          venTotal = f.format(venTotal);
          cobraTotal = f.format(cobraTotal);
          espeTotal = f.format(espeTotal);
          efeCajaT= f.format(efeCajaT);
          capital= f.format(capital);
          gananCobTotal = f.format(gananCobTotal);
          gastocajaMes = f.format(gastocajaMes);
          return res.render('generalCobranza', {porCobrar, ArrayUserGene, usuario, cajaList, cantPres, venTotal, ganaTotal, cobraTotal, espeTotal, porcentajeT, efeCajaT, capital, invT,  gastocajaMes, gananCobTotal});
    
   } catch (error) {
    
}};
const guardarCaja = async(req, res) => {
    try {
      const newOperacion = new caja(req.body);
      const fecha = newOperacion.fecha;
      const anio = new Date(fecha).getFullYear();
      const mes = new Date(fecha).getMonth();
      const dia = new Date(fecha).getUTCDate();

        
      const fechaAc = new Date(anio, mes, (dia + 1)).toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
      newOperacion.timeStamp = new Date(anio, mes, dia).toDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
      console.log("fecha timestamp" + newOperacion.timeStamp);
      newOperacion.fecha =  fechaAc;
       await newOperacion.save();

       res.redirect('/general');
        
    } catch (error) {
        
    }
}
const deleteCajaOpe = async(req, res)=>{
try {
  const {_id} = req.params;
  const opeDelete = await caja.findByIdAndDelete(_id);
  console.log("Delete: " + opeDelete);
  res.redirect('/general/');
} catch (error) {
  const mensajeError = error;
  res.render('error', {mensajeError});
}
};

const cargarPrestamosRuta = async(req, res) =>{
    try {
       const {nRuta} = req.params;
       console.log(nRuta);
       const prestamos = await ventas.find({ cobRuta: nRuta}).sort({nombre: 1});
       const usuario = await users.findOne({numRuta: nRuta}); 
       res.render('cobranzaAdmin', {prestamos, usuario});
    
   } catch (error) {
    
   }
  };
const cargarEstadoClient = async(req, res) => {
  
  try {
    const {dni} = req.params;
    const prestamos = await ventas.find({dni: dni});
    const historyVentas = await hVentas.find({dni});
    const cliente = await client.findOne({dni});
    console.log("dni del perno:" + cliente);
    res.render('listPresClient', {prestamos, dni, historyVentas, cliente}) ;
  } catch (error) {
    
  }
};
   const cargarEstadisticas = async (req, res) => {
    var arrayAnios = [{anio:2024}, { anio:2025}, { anio: 2026}, { anio: 2027}, { anio:2028}, { anio:2029}, { anio:2030}]; 
    var {nRuta} = req.params;
    const token =  req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    const user = verifyToken.role;
    console.log("rol............." + user);
    const {numRutaInp, mesInp, anioInp} = req.body;
    console.log(`numRuta ${numRutaInp} mes ${mesInp} año ${anioInp}`);
    var anio = anioInp || new Date().getFullYear();
     var mes = mesInp || new Date().getMonth();
     var cantDias = (new Date(anio, (mes+1), 0).getDate());
     cantDias = cantDias ;
     var numR = numRutaInp || nRuta;
     console.log("fechaForm " + anio);
    const balance = await balances.find({cobRuta: numR, categoria: 'balance_diario', timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias,23,59,59,0)}});
    const hisVent = await hVentas.find({venRuta: numR, timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias,23,59,59,0)}});
    const opeCaja = await caja.find({userCod: numR,tipo: ["sueldos", "rendicion"], timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias,23,59,59,0)}}).sort({timeStamp: -1});
    var cajaGastos = await caja.find({userCod: numR, tipo: "sueldos",  timeStamp:{$gte:new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias,23,59,59,0)}});
    var cobradoT = 0;
    var esperadoT = 0;
    var gastoT = 0;
    var opeT = 0;
    balance.forEach(element => {
      cobradoT = element.cobrado + cobradoT;
      esperadoT = element.esperado + esperadoT;
    });
    cajaGastos.forEach(element => {
      gastoT = element.monto + gastoT;
    });
    opeCaja.forEach(element => {
      opeT = element.monto + opeT;
    });
    const porcentaje = parseInt((cobradoT / esperadoT)*100);
    var efectivo = cobradoT - opeT;
    cobradoT = f.format(cobradoT);
    esperadoT = f.format(esperadoT);
    gastoT = f.format(gastoT);
    efectivo = f.format(efectivo);
    if (user == "admin") {
      res.render('generalEstadisUsuario', {balance, cobradoT, esperadoT, porcentaje, hisVent, opeCaja, numR, gastoT, arrayAnios, efectivo});
    }
    res.render('estadisticas', {balance, cobradoT, esperadoT, porcentaje, hisVent, opeCaja, numR, gastoT, arrayAnios, efectivo});
  };
const editCliente = async(req, res) =>{
    const {dni} = req.params;
    const cliente = await client.findOne({dni});
    res.redirect(`/client/edit/${cliente._id}`);
}


//Node-cron para ejecutar funciones en tiempo especifico
 cron.schedule('55 20 * * *',() =>{
      guardarBalanceDiario();
 },{
  scheduled: true,
  timezone: 'America/Buenos_Aires'
 });
 //Node-cron para ejecutar funciones en tiempo especifico

cron.schedule('55 20 * * * ',()=>{
    balanceDelete();
},{
  scheduled: true,
  timezone: 'America/Buenos_Aires'
  });

module.exports = {cargarGeneral, guardarCaja, cargarPrestamosRuta, editCliente, cargarEstadisticas, deleteCajaOpe, load, cargarEstadoClient};
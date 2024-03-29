const users = require("../models/userModels");
const ventas = require('../models/ventasModels');
const pagoN = require('../models/pagosModels');
const balances = require('../models/balanceModels');
const caja = require('../models/cajaModels');
const client = require("../models/clientModels");

const f = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
});

const cargarGeneral = async(req, res) => {
  try {
    const usuario = await users.find({role: "cobrador"});
    var anio = new Date().getFullYear();
    var mes = new Date().getMonth();
    var cantDias = new Date(anio, (mes+1), 0).getDate();
    const prest = await ventas.find();
    const ventasTo = await balances.find({categoria: "balance_diario", timeStamp:{$gte:new Date(anio,mes,0), $lte: new Date(anio,mes,cantDias)}});
    const cajaList = await caja.find({timeStamp:{$gte:new Date(anio,mes,0), $lte: new Date(anio,mes,cantDias)}});
    var porCobrar = 0;
    var venTotal = 0; //ventas totales
    var ganaTotal = 0; //ganacias totales de todas las rutas
    var cobraTotal= 0; //cobrado total de todas las rutas
    var espeTotal = 0; //esperado total de todas las rutas
    //sumamos todas las ventas y ganacias totales de las rutas
    ventasTo.forEach(element => {
      venTotal = element.ventas + venTotal;
      ganaTotal = element.ganancia + ganaTotal;
      cobraTotal = element.cobrado + cobraTotal;
      espeTotal = element.esperado + espeTotal;
    });
    const fechaAc = new Date("2024/2/1");
    const vent = await ventas.find({timeStamp:{$gte:new Date(anio,mes,0), $lte: new Date(anio,mes,cantDias)}});
       prest.forEach(element => {
           porCobrar = element.mTotal + porCobrar;
        });
        const ArrayUserGene = [];
        
        for (let i = 0; i < usuario.length; i++) {
            const element = usuario [i];
            var espeT = 0;
            var cobT = 0;
            var venT = 0;
            var ganaT =0;
            var gastoT = 0;
            var porCobrarT = 0;
            var cajaRendicion = await ventas.aggregate([{$group:{cobRuta: element.numRuta, montoTotal: {$sum: $mTotal}}}]);
            console.log("Monto total: " + cajaRendicion);
            var prestT = await ventas.find({cobRuta: element.numRuta});
            var balan = await balances.find({cobRuta: element.numRuta, timeStamp:{$gte:new Date(anio,mes,0), $lte: new Date(anio,mes,cantDias)}, categoria: 'balance_diario'});
            balan.forEach(element => {
                espeT = element.esperado + espeT;
                cobT = element.cobrado + cobT;
                venT = element.ventas + venT;
                ganaT = element.ganancia + ganaT;
                gastoT = element.gastos + gastoT;
            });
              prestT.forEach(element => {
                 porCobrarT = element.mTotal + porCobrarT;
              });
                const efectividad = ((cobT/espeT)*100).toFixed(2);
                espeT = f.format(espeT);
                cobT = f.format(cobT);
                venT = f.format(venT);
                ganaT = f.format(ganaT);
                gastoT = f.format(gastoT);
                porCobrarT = f.format(porCobrarT);
                const cPres = prestT.length;
             ArrayUserGene.push({espeT, cobT, venT, ganaT, gastoT, nombre: element.nombre, nRuta: element.numRuta, efectividad, porCobrarT, cPres});
        }
          porCobrar = f.format(porCobrar);
              var cantPres = prest.length;
          var porcentajeT = ((cobraTotal/espeTotal)*100).toFixed(2);
          ganaTotal = f.format(ganaTotal);
          venTotal = f.format(venTotal);
          cobraTotal = f.format(cobraTotal);
          espeTotal = f.format(espeTotal);
    return res.render('generalCobranza', {porCobrar, ArrayUserGene, usuario, cajaList, cantPres, venTotal, ganaTotal, cobraTotal, espeTotal, porcentajeT});
    
   } catch (error) {
    
}};
const guardarCaja = async(req, res) => {
    try {
        const fechaAc = new Date().toLocaleDateString();
        const newOperacion = new caja(req.body);
        newOperacion.fecha = fechaAc;
       await newOperacion.save();

       res.redirect('/general');
        
    } catch (error) {
        
    }
}
const cargarPrestamosRuta = async(req, res) =>{
    try {
       const {nRuta} = req.params;
       console.log(nRuta);
       const prestamos = await ventas.find({ cobRuta: nRuta}).sort({fechaUltPago: 1});
       const usuario = await users.findOne({numRuta: nRuta}); 
       res.render('cobranzaAdmin', {prestamos, usuario});
    
   } catch (error) {
    
   }
};
   const cargarEstadisticas = async (req, res) => {
    var {numRuta} = req.params;
    var anio = new Date().getFullYear();
     var mes = new Date().getMonth();
     var cantDias = new Date(anio, (mes+1), 0).getDate();
    const balance = await balances.find({cobRuta: numRuta, categoria: 'balance_diario', timeStamp:{$gte: new Date(anio,mes,0), $lt: new Date(anio,mes,cantDias)}});
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
const editCliente = async(req, res) =>{
    const {dni} = req.params;
    const cliente = await client.findOne({dni});
    res.redirect(`/client/edit/${cliente._id}`);
}


module.exports = {cargarGeneral, guardarCaja, cargarPrestamosRuta, editCliente, cargarEstadisticas};
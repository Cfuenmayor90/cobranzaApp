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
       const mesDate = (new Date().getMonth())+1;
       const añoDate = new Date().getFullYear();
       var iniMes = `1/${mesDate}/${añoDate}`;
       const prest = await ventas.find();
       const cajaList = await caja.find();
       var porCobrar = 0;

       const fechaAc = new Date("2024/2/1");
        console.log(fechaAc);
       const vent = await ventas.findOne({fechaInicio:{$gte: fechaAc}});
       console.log(vent);

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
            var prestT = await ventas.find({cobRuta: element.numRuta});
            var balan = await balances.find({cobRuta: element.numRuta, fecha: {$gte:iniMes}, categoria: 'balance_diario'});
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
             ArrayUserGene.push({espeT, cobT, venT, ganaT, gastoT, nombre: element.nombre, nRuta: element.numRuta, efectividad, porCobrarT});
        }
          porCobrar = f.format(porCobrar);
       
    return res.render('generalCobranza', {porCobrar, ArrayUserGene, usuario, cajaList});
    
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
    const {numRuta} = req.params;
    const balance = await balances.find({ cobRuta: numRuta, categoria: "balance_diario" });
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
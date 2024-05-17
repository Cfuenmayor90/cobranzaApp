const users = require("../models/userModels");
const setPrest = require('../models/settingsModels');
const client = require("../models/clientModels");
const ventas = require('../models/ventasModels');
const historyVentas = require('../models/historyVentas');
const product = require('../models/productModels');



const cargarVentas = async(req, res) => {
    const fechaHoy = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
     const usuarios = await users.find();
     const productos = await product.find().sort({nombre: 1});
     const planPrest = await setPrest.find({categoria: 'prestamo'}).sort({porcentaje: 1});
     const planProd = await setPrest.find({categoria: 'financiamiento'}).sort({porcentaje: 1});
     const ventasT = await ventas.find().sort({timeStamp: -1}).limit(10);
     return res.render('ventas', {usuarios, planPrest, planProd, ventasT, productos});
}
//cargar ventas especificas de usuarios como vendedore y cobradores
const cargarVenCob = async(req, res) =>{
  const {nRuta} = req.params;
  res.send('ssss')
}

const cotizarPlan = async(req, res) => {
  try {
    const cot = req.body;
    const cliente = await client.findOne({dni:cot.dni});
    if (cliente) {
      console.log(cot);
      const planCot = await setPrest.findById({_id:cot.planId});
      const mTotal = (cot.monto * ((planCot.porcentaje / 100)+1)).toFixed(2);
      const cuota = (mTotal / planCot.cuotas).toFixed(2);
      //res.send(`Monto:${cot.monto}, Cuotas: ${planCot.cuotas}, Cuota: ${cuota}, Total: ${mTotal}`);
      res.render('confirmarVenta', {cot, planCot, cuota, mTotal, cliente})
      
    } else {
      const mensajeError = 'El Usuario No Existe';
      res.render('error', {mensajeError})
    }
    
  } catch (error) {
    res.render('error');
  }
};
const guardarVentas = async(req,res) => {
 const newVenta = new ventas(req.body);
 newVenta.total = newVenta.mTotal;
 var diaAc = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
 var fechaV = new Date();
 console.log(diaAc);
 var fechaVencimiento = "";
 if (newVenta.plan === "diario") {
  var DiaDom = parseInt(newVenta.cuotas/6);
   fechaVencimiento = new Date(fechaV.setDate(fechaV.getDate() + (newVenta.cuotas + DiaDom)));
 } else {
  fechaVencimiento = new Date(fechaV.setDate(fechaV.getDate() + (newVenta.cuotas * 7)));
 }
 newVenta.fechaInicio = diaAc;
 newVenta.fechaFinal = fechaVencimiento.toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
 newVenta.DateFinal= fechaVencimiento;
 await newVenta.save();
 if (newVenta.venRuta !== 1) {
  if (newVenta.categoria == "prestamo") {
    newVenta.mTotal = newVenta.monto;
  }
  const newHistoryVenta = new historyVentas({
    nombre: newVenta.nombre,
    dni: newVenta.dni,
    venRuta: newVenta.venRuta,
    cobRuta: newVenta.cobRuta,
    codProd: newVenta.codProd,
    detalle: newVenta.detalle,
    mTotal: newVenta.mTotal,
    categoria: newVenta.categoria,
    plan: `${newVenta.plan} / Cuotas: ${newVenta.cuotas} / Cuota: ${newVenta.cuota}`,
    fechaInicio: diaAc
  });
  await newHistoryVenta.save();
 }
 res.redirect('/ventas');
};





module.exports = {cotizarPlan, cargarVentas, guardarVentas, cargarVenCob};
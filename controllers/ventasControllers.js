const users = require("../models/userModels");
const setPrest = require('../models/settingsModels');
const client = require("../models/clientModels");
const ventas = require('../models/ventasModels');
const historyVentas = require('../models/historyVentas');
const product = require('../models/productModels');
const balance = require('../models/balanceModels');
const setValores = require('../models/settingValoresModels');


const cargarVentas = async(req, res) => {
    const fechaHoy = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
     const usuariosVent = await users.find({role: ['cobrador','vendedor', 'pisoDeVenta']});
     const usuariosCob = await users.find({role: ['cobrador', 'pisoDeVenta']});
     const productos = await product.find().sort({nombre: 1});
     const planPrest = await setPrest.find({categoria: 'prestamo'}).sort({porcentaje: 1});
     const planProd = await setPrest.find({categoria: 'financiamiento'}).sort({porcentaje: 1});
     const ventasT = await ventas.find().sort({timeStamp: -1}).limit(30);
     return res.render('ventas', {usuariosVent,usuariosCob, planPrest, planProd, ventasT, productos});
}
//cargar ventas especificas de usuarios como vendedore y cobradores
const cargarVenCob = async(req, res) =>{
  const {nRuta} = req.params;
  res.send('ssss')
}

const cotizarPlan = async(req, res) => {
  try {
    const cot = req.body;
    console.log(cot);
    
    var mensajeError = '';
    const fecha = cot.fecha;
    const anio = new Date(fecha).getFullYear();
    const mes = new Date(fecha).getMonth();
    const dia = new Date(fecha).getUTCDate();
    const fechaVent = new Date(anio, mes, (dia + 1)).toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const cliente = await client.findOne({dni:cot.dni});
    const balanCEDiario = await balance.findOne({cobRuta: cot.cobRuta, fecha: fechaVent});
    console.log("fecha de venta " + cot.fecha);
    console.log("balance encontrado " + balanCEDiario);
    if (!cliente) {
      mensajeError = '¡El Cliente NO existe en la DATA BASE!';
      res.render('error', {mensajeError});
    }
    if (balanCEDiario) {
      console.log("cotizar producto");
      //array con codigos de productos o prestamo
      const arrayCod = [];
      console.log(cot);
      if (cot.codProd == "prestamo") {
        const planCot = await setPrest.findById({_id:cot.planId});
        const mTotal = (cot.monto * ((planCot.porcentaje / 100)+1)).toFixed(2);
        const cuota = (mTotal / planCot.cuotas).toFixed(2);
        arrayCod.push({"cod": cot.codProd});
        res.render('confirmarVenta', {cot, planCot, cuota, mTotal, cliente, arrayCod});
      }
      else{
        
        const valores = await setValores.findOne();
        const codProducts = cot.codProd;
        var precio = 0;
        if (Array.isArray(codProducts)) {
          for (let i = 0; i < codProducts.length; i++) {
            const element = codProducts[i];
            console.log(element);
            
            var prod = await product.findOne({cod: element});
            console.log("producto");
            console.log(prod);
            precio = prod.precio + precio;
            console.log(precio);
            arrayCod.push({"cod":element});
          };  
        }
        else{
          var prod = await product.findOne({cod: codProducts});
          arrayCod.push({"cod":codProducts});
          precio= prod.precio;
        }
       
        const precioT = (precio * valores.dolar) * ((valores.porcentaje / 100) +1);
        const des = (cot.descuento / 100);
    
        const planCot = await setPrest.findById({_id:cot.planId});
        const mTotal = ((precioT * ((planCot.porcentaje / 100)+1))-(des * (precioT * ((planCot.porcentaje / 100)+1)))).toFixed(2);
        const cuota = (mTotal / planCot.cuotas).toFixed(2);
        res.render('confirmarVenta', {cot, planCot, cuota, mTotal, cliente, arrayCod});
        
      }
     }
    else{
      mensajeError = '¡La fecha de venta ingresada no es permitida!, elija una fecha que tenga un BALANCE DIARIO generado en esa ruta de cobro';
      res.render('error', {mensajeError});
    }
    
  } catch (error) {
    res.render('error');
  }
};
const guardarVentas = async(req,res) => {
try {
  const {fecha} = req.body;
  const newVenta = new ventas(req.body);
  const cdp = req.body.codProd;
  console.log("New venta......................");
  console.log(newVenta);
  newVenta.total = newVenta.mTotal;
  newVenta.mTotal = newVenta.mTotal - newVenta.adelanto;
 console.log("codigos productos  ");
 console.log(cdp);
  const cliente = await client.findOne({dni: newVenta.dni});
  newVenta.geolocalizacion = cliente.geolocalizacion;
  const anio = new Date(fecha).getFullYear();
  const mes = new Date(fecha).getMonth();
  const dia = new Date(fecha).getUTCDate();
  const fechaAc = new Date(anio, mes, (dia + 1)).toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  var fechaV  = new Date(anio, mes, dia);//.toDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  var fechaVencimiento = "";
  if (newVenta.plan === "diario") {
    var DiaDom = parseInt(newVenta.cuotas/6);
    fechaVencimiento = new Date(fechaV.setDate(fechaV.getDate() + (newVenta.cuotas + DiaDom)));
  } else {
    fechaVencimiento = new Date(fechaV.setDate(fechaV.getDate() + (newVenta.cuotas * 7)));
  }
  newVenta.timeStamp =  new Date(anio, mes, dia).toDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  newVenta.fechaInicio = fechaAc;
  newVenta.fechaFinal = fechaVencimiento.toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  newVenta.DateFinal= fechaVencimiento;
  var montGanancia = newVenta.total - newVenta.monto;
  const balan = await balance.findOne({cobRuta: newVenta.cobRuta, fecha: fechaAc});
  balan.ventas = balan.ventas + newVenta.monto;
  balan.ganancia = balan.ganancia + montGanancia;
  await balance.findByIdAndUpdate(balan._id, balan);
  await newVenta.save();
  
  if (newVenta.venRuta !== 1) {
    if (newVenta.categoria == "prestamo") {
      newVenta.monto = newVenta.monto;
    }
    const newHistoryVenta = new historyVentas({
      nombre: newVenta.nombre,
      dni: newVenta.dni,
      venRuta: newVenta.venRuta,
      cobRuta: newVenta.cobRuta,
      codProd: cdp,
      detalle: newVenta.detalle,
      mTotal: newVenta.total,
      categoria: newVenta.categoria,
      plan: `${newVenta.plan} / Cuotas: ${newVenta.cuotas} / Cuota: ${newVenta.cuota}`,
      fechaInicio: fechaAc
    });
    await newHistoryVenta.save();
  }

  var prod= 0;
  if (Array.isArray(cdp)) {
    for (let i = 0; i < cdp.length; i++) {
      const element = cdp[i];
      prod = await product.findOne({cod: element});
      prod.stock = prod.stock -1;
      await product.findByIdAndUpdate({_id: prod._id}, prod);
      console.log("new venta");
      console.log(element);
    }
  } else if (cdp != 'prestamo') {
      console.log("else if");
      
      prod = await product.findOne({cod: cdp});
      prod.stock = prod.stock -1;
      await product.findByIdAndUpdate({_id: prod._id}, prod);
      
    } 
  
  res.redirect('/ventas');
  } catch (error) {
    const mensajeError = error;
    res.render('error', {mensajeError});
}
};





module.exports = {cotizarPlan, cargarVentas, guardarVentas, cargarVenCob};
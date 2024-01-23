const users = require("../models/userModels");
const setPrest = require('../models/settingsModels');
const ventas = require('../models/ventasModels');



const cargarVentas = async(req, res) => {
     const usuarios = await users.find();
     const planPrest = await setPrest.find({categoria: 'prestamo'}).sort({porcentaje: 1});
     const planProd = await setPrest.find({categoria: 'financiamiento'}).sort({porcentaje: 1});
     return res.render('ventas', {usuarios, planPrest, planProd});
}

const cotizarPlan = async(req, res) => {
  try {
    const cot = req.body;
    const client = await users.findOne({dni:cot.dni});
    if (client) {
      console.log(cot);
      const planCot = await setPrest.findById({_id:cot.planId});
      const mTotal = (cot.monto * ((planCot.porcentaje / 100)+1)).toFixed(2);
      const cuota = (mTotal / planCot.cuotas).toFixed(2);
      //res.send(`Monto:${cot.monto}, Cuotas: ${planCot.cuotas}, Cuota: ${cuota}, Total: ${mTotal}`);
      res.render('confirmarVenta', {cot, planCot, cuota, mTotal, client})
      
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
 await newVenta.save();
 res.redirect('/ventas');
};

module.exports = {cotizarPlan, cargarVentas, guardarVentas};
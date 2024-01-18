const { json } = require('express');
const setPrest = require('../models/settingsModels');
const setvalores = require('../models/settingValoresModels');

const cargarSettins = async(req,res) =>{
    try {
        const planActualPres = await setPrest.find({categoria: 'prestamo'});
        const planActualProd = await setPrest.find({categoria:'financiamiento'});
        const valores = await setvalores.find();
        res.render('configuracion', {planActualPres, planActualProd, valores});
    } catch (error) {
        
    }
}

const guardarPlan = async(req, res) => {
    try {
       const planNuevo = new setPrest(req.body);
       await planNuevo.save();
       res.redirect('/settings');
    } catch (error) {
        
    }
};
const guardarValores = async(req, res) => {
    try {
        const newValores = new setvalores(req.body);
        await newValores.save()
        res.redirect('/settings');
    } catch (error) {
        
    }
}
const updateValores = async(req,res) => {
   try {
    const valoresNuevos = req.body;
    console.log(valoresNuevos);
    const {id} = req.params;
    await setvalores.findByIdAndUpdate({_id:id}, valoresNuevos);
    res.redirect('/settings');
   } catch (error) {
    
   }

};
const deletePlan = async(req,res)=>{
    try {
        const {id} = req.params;
        await setPrest.findByIdAndDelete(id);
        res.redirect('/settings');

    } catch (error) {
        
    }
}

module.exports = {guardarPlan, cargarSettins, deletePlan, updateValores, guardarValores};
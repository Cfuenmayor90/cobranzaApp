const { json } = require('express');
const setPrest = require('../models/settingsModels');
const setvalores = require('../models/settingValoresModels');
const creditCard = require('../models/creditCardModels');
const nodemon = require('nodemon');

const cargarSettins = async(req,res) =>{
    try {
        const planActualPres = await setPrest.find({categoria: 'prestamo'});
        const planActualProd = await setPrest.find({categoria: ['financiamiento', 'particular']}).sort({categoria: 1, plan: 1, cuotas: 1});
        const valores = await setvalores.find();
        const creditCards = await creditCard.find().sort({nombre: 1,  cuotas: 1});
        res.render('configuracion', {planActualPres, planActualProd, valores, creditCards});
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
};
const createCreditCard = async(req,res) => {
    try {
        const newCard = new creditCard(req.body);
        await newCard.save();
        res.redirect('/settings');
    } catch (error) {
        res.status(500).send('Error creating credit card');
    }
};

const deleteCreditCard = async(req,res) => {
    try {
        const {id} = req.params;
        await creditCard.findByIdAndDelete(id);
        res.redirect('/settings');
    } catch (error) {
        res.status(500).send('Error deleting credit card');
    }
};

module.exports = {guardarPlan, cargarSettins, deletePlan, updateValores, guardarValores, createCreditCard, deleteCreditCard};
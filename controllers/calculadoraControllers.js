const { json } = require('express');
const setPrest = require('../models/settingsModels');
const setvalores = require('../models/settingValoresModels');
const { parse } = require('path');

const cargarCalculadora = async(req,res) =>{
    try {
        const monto = 10;
        const planes = await setPrest.find({categoria: 'prestamo'});
        const array = [];
        planes.forEach(element => {
            const xcentaje = (element.porcentaje/100)+1;
            const cuota = parseFloat((monto*xcentaje)/element.cuotas).toFixed(2);
            const total = (element.cuotas * cuota).toFixed(2);
            array.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota, "total": total });
        });
        return res.render('calculadora', {array, monto});
    } catch (error) {
        
    }
};
const calcular = async(req,res) =>{
    try {
        const {monto, desc} = req.body;
        const planes = await setPrest.find({categoria: 'prestamo'});
        const planesProdu = await setPrest.find({categoria: 'financiamiento'});
        const valores = await setvalores.findOne();
        const montoProd = monto * ((valores.porcentaje/100)+1);
        const array = [];
        const arrayProd = [];
        planes.forEach(element => {
            const xcentaje = (element.porcentaje/100)+1;
            const cuota = parseFloat((monto*xcentaje)/element.cuotas).toFixed(2);
            const total = (element.cuotas * cuota).toFixed(2);
            array.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota, "total": total });
        });
        planesProdu.forEach(element => {
            const xcentaje= (element.porcentaje/100)+1;
            const cuota = parseFloat((montoProd*xcentaje)/element.cuotas).toFixed(2);
            arrayProd.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota});
        
        });
        return res.render('calculadora', {array, arrayProd, monto, desc});
 
    } catch (error) {
        res.render('error')
    }
};

module.exports = {calcular, cargarCalculadora};
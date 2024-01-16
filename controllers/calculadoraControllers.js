const { json } = require('express');
const setPrest = require('../models/settingsModels');
const { parse } = require('path');

const cargarCalculadora = async(req,res) =>{
    try {
        const montoPres = 10;
        const planes = await setPrest.find({categoria: 'prestamo'});
        const array = [];
        planes.forEach(element => {
            const xcentaje = (element.porcentaje/100)+1;
            const cuota = parseFloat((montoPres*xcentaje)/element.cuotas).toFixed(2);
            const total = (element.cuotas * cuota).toFixed(2);
            array.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota, "total": total });
        });
        console.log(array);
        return res.render('calculadora', {array});
 
    } catch (error) {
        
    }
};
const calcular = async(req,res) =>{
    try {
        const {monto} = req.body;
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
        res.render('error')
    }
};

module.exports = {calcular, cargarCalculadora};
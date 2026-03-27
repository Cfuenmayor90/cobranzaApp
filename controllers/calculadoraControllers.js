const { json } = require('express');
const setPrest = require('../models/settingsModels');
const setvalores = require('../models/settingValoresModels');
const product = require('../models/productModels');
const { parse } = require('path');
const { log } = require('console');
const f = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
});

const cargarCalculadora = async(req,res) =>{
    try {
        const monto = 10;
        const planes = await setPrest.find({categoria: 'prestamo'});
        const productos = await product.find().sort({nombre: 1});
        const array = [];
        planes.forEach(element => {
            const xcentaje = (element.porcentaje/100)+1;
            const cuota = parseFloat((monto*xcentaje)/element.cuotas).toFixed(2);
            const total = (element.cuotas * cuota).toFixed(2);
            array.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota, "total": total });
        });
        return res.render('calculadora', {array, monto, productos});
    } catch (error) {
        
    }
};
const presupuestoProdCant = async(req,res) =>{
    try {
        const {codProd, descuento} = req.body;
        const codProducts = codProd;
        const arrayCod = [];
                if (Array.isArray(codProducts)) {
                  for (let i = 0; i < codProducts.length; i++) {
                    const element = codProducts[i];
                    var prod = await product.findOne({cod: element});
                    arrayCod.push({"cod":element,"nombre": prod.nombre});
                  };  
                  res.render('presupuesto', {arrayCod, descuento});
                }
                else{
                  var prod = await product.findOne({cod: codProducts});
                  arrayCod.push({"cod":codProducts, "nombre": prod.nombre});
                  precio= prod.precio;
                  res.render('presupuesto', {arrayCod, descuento});
                }
    } catch (error) {
        res.render('error');
    }
};
 const presupuestoProdFinal = async(req,res) =>{
    try {
        const {codProd, descuento} = req.body;
         const planesDiarios = await setPrest.find({categoria: "financiamiento",plan: "diario" }).sort({cuotas: 1});
        const planesSemanales = await setPrest.find({categoria: "financiamiento",plan: "Semanal" }).sort({cuotas: 1});
        const planesMensuales = await setPrest.find({categoria: "financiamiento",plan: "mensual" }).sort({cuotas: 1});
        const planesParticulares = await setPrest.find({categoria: 'particular'}).sort({plan: 1, cuotas: 1});
        const valores = await setvalores.findOne();
        var precio = 0;
        var precioTartj = 0;

        const ArrayInfProd = [];
        if (Array.isArray(codProd)) {
            for (let i = 0; i < codProd.length; i++) {
            
              const element = codProd[i];
              var cantProd = req.body[element];
              console.log("Cant de productos");
              
              var prod = await product.findOne({cod: element});
              var precioProd = ((prod.precio)*valores.dolar) * ((valores.porcentaje/100)+1);
              precio = (precioProd * cantProd) + precio;
              precioProd = precioProd * (valores.tcredito/100 + 1);
              precioTartj = precioTartj + (precioProd * cantProd);
              ArrayInfProd.push({"cod":element,"nombre": prod.nombre, "precio": f.format(precioProd), "cant": cantProd, "Total": f.format(precioProd * cantProd)   });
            }
            console.log("salimos del if");}
            else{
              var prod = await product.findOne({cod: codProd});
              var precioProd = ((prod.precio)*valores.dolar) * ((valores.porcentaje/100)+1);
                var cantProd = req.body[codProd];
                precio = (precioProd * cantProd) + precio;
                precioProd = precioProd * (valores.tcredito/100 + 1);
                precioTartj = precioTartj + (precioProd * cantProd);
              ArrayInfProd.push({"cod":codProd, "nombre": prod.nombre, "precio": f.format(precioProd), "cant": cantProd, "Total": f.format(precioProd * cantProd)      });
            }   
            //descuentos
            if (descuento > 0){
                var descuentoAplicado = precio * (descuento/100);
                precio = precio - descuentoAplicado;
                precioTartj = precioTartj - descuentoAplicado;
            }

             console.log("salimos del if");
            var vCuota = precioTartj / 3;
        var arrayPlanes = [];
        var arrayPlanesParticulares = [];
        planesDiarios.forEach(element => {
            var xcentaje = (element.porcentaje/100)+1;
            var cuota = (precio*xcentaje)/element.cuotas;
            cuota = f.format(cuota)
            arrayPlanes.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota });
        });
        planesSemanales.forEach(element => {
            var xcentaje= (element.porcentaje/100)+1;
            var cuota =(precio*xcentaje)/element.cuotas;
            cuota = f.format(cuota);
            arrayPlanes.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota});
    });
    planesMensuales.forEach(element => {
            var xcentaje= (element.porcentaje/100)+1;
            var cuota =(precio*xcentaje)/element.cuotas;
            cuota = f.format(cuota);
            arrayPlanes.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota});

             });

    planesParticulares.forEach(element => {
            var xcentaje= (element.porcentaje/100)+1;
            var cuota =(precio*xcentaje)/element.cuotas;
            cuota = f.format(cuota);
            arrayPlanesParticulares.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota, "total": f.format(precio*xcentaje)}); 
    });
    precioTartj = f.format(precioTartj);
    precio = f.format(precio);
    vCuota = f.format(vCuota);
    descuentoAplicado = f.format(descuentoAplicado);
  
    res.render('presupuestoFinal', {arrayPlanes, arrayPlanesParticulares, ArrayInfProd, descuento, descuentoAplicado, vCuota, precioTartj, precio});
    } 
    catch (error) {
        res.render('error');
    }};            
          

const calcular = async(req,res) =>{
    try {
        const {monto, desc} = req.body;
        const planes = await setPrest.find({categoria: 'prestamo'});
        const planesProdu = await setPrest.find({categoria: 'financiamiento'});
        const valores = await setvalores.findOne();
        const montoProd = monto * ((valores.porcentaje/100)+1);
        const array = [];
        const arrayProd = [];
       for (let i = 0; i < planes.length; i++) {
            var element = planes[i];
            var xcentaje = (element.porcentaje/100)+1;
            var cuota = (monto*xcentaje)/element.cuotas;
            var total = (element.cuotas * cuota);
            cuota = f.format(cuota);
            total = f.format(total);
            array.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota, "total": total });
       
            
       }
        for (let i = 0; i < planesProdu.length; i++) {
            var element = planesProdu[i];
            var xcentaje= (element.porcentaje/100)+1;
            var cuota = (montoProd*xcentaje)/element.cuotas;
           cuota = f.format(cuota);
            arrayProd.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota});
        }
    
        return res.render('calculadora', {array, arrayProd, monto, desc});
 
    } catch (error) {
        res.render('error')
    }
};

module.exports = {calcular, cargarCalculadora, presupuestoProdCant, presupuestoProdFinal};
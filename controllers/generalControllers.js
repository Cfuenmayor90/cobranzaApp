const users = require("../models/userModels");
const ventas = require('../models/ventasModels');
const pagoN = require('../models/pagosModels');
const balances = require('../models/balanceModels');

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
       
    return res.render('generalCobranza', {porCobrar, ArrayUserGene, usuario});
    
   } catch (error) {
    
   }

}

module.exports = {cargarGeneral};
const users = require("../models/userModels");
const ventas = require('../models/ventasModels');
const pagoN = require('../models/pagosModels');

const cargarGeneral = async(req, res) => {
   try {
       const usuario = await users.find({role: "cobrador"});
       const mesDate = (new Date().getMonth())+1;
       const añoDate = new Date().getDay("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
       const hrActual = new Date().toTimeString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
       const iniMes = `0/${mesDate}/${añoDate}`;
        console.log(añoDate);
        console.log(hrActual);
        const fecha = hrActual == "18:22:00" ;
        if ( "18:00:00" <= hrActual && hrActual <= "19:00:00" && mesDate !== 2) {
            console.log("if ok");
        } else {
        console.log("else");
        }
        console.log(fecha);
       
      /* for (let i = 0; i < usuario.length; i++) {
        console.log("for");
           var element = usuario[i];
           var venta = await ventas.find({cobRuta: element.numRuta});
           var pagos = await pagoN.find({ cobRuta: element.numRuta});
        
           venta.forEach(element => {
            
           });
           console.log(venta);
           console.log(pagos);
           
       };*/
    return res.render('generalCobranza');
    
   } catch (error) {
    
   }

}

module.exports = {cargarGeneral};
const ventas = require('../models/ventasModels');
const pagoN = require('../models/pagosModels');


const cargarAlertas = async(req, res)=> {
     var fechaAc = new Date().toLocaleDateString('es-AR', {timeZone: 'America/Buenos_Aires'});
     console.log('fecha actual ' + fechaAc);
    try {
        const presCancelados = await ventas.find({mTotal: 0});
        const presVencidos = await ventas.find({fechaFinal:{$gte: fechaAc}});
        res.render('alertas', {presCancelados, presVencidos});
    } catch (error) {
        
    }
};
const eliminarTodos = async(req, res) =>{
    try {
          //Codigo para eliminar los prestamos y pagos cancelados
      const prestCancelados = await ventas.find({mTotal: 0});
      for (let i = 0; i < prestCancelados.length; i++) {
        const element = prestCancelados[i];
         await pagoN.deleteMany({codPres:element._id});
         await ventas.findByIdAndDelete(element._id);
        } 
        res.redirect('/alertas');
    } catch (error) {
        
    }
};
const eliminarUno = async(req, res)=>{
    const {id} = req.params;
    try {
       const pagosElim = await pagoN.deleteMany({codPres:id});
       const ventaElim =  await ventas.findByIdAndDelete(id);
        res.redirect('/alertas');
        
    } catch (error) {
        res.render('error');
    }
};
module.exports = {cargarAlertas, eliminarTodos, eliminarUno};
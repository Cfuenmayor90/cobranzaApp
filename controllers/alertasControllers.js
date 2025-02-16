const ventas = require('../models/ventasModels');
const pagoN = require('../models/pagosModels');
const f = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
});

const cargarAlertas = async(req, res)=> {
     var anio = new Date().getFullYear();
     var mes = new Date().getMonth();
     var dia = new Date().getDate();
     console.log(`fecha actual:` +  new Date(anio,mes,dia) );
    try {
        const presCancelados = await ventas.find({mTotal: 0});
        const presVencidos = await ventas.find({DateFinal:{$lte: new Date(anio,mes,dia)}});
        

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
        const dia = new Date().toLocaleDateString();
        const pres = await ventas.findById(id);
        console.log("dia " + dia);
        console.log("ultimo pago: " + pres.fechaUltPago);
        
        
        if (pres.fechaUltPago != dia) {
            const pagosElim = await pagoN.deleteMany({codPres:id});
            const ventaElim =  await ventas.findByIdAndDelete(id);
             res.redirect('/alertas');
        }
        const mensajeError = "No se puede eliminar una cuenta cancelada el dia de hoy, espere hasta el dia siguiente";
        res.render('error', {mensajeError});
        
    } catch (error) {
        res.render('error');
    }
};
module.exports = {cargarAlertas, eliminarTodos, eliminarUno};
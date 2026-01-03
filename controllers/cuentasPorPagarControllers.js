const cxp = require('../models/cxpModels');
const caja = require('../models/cajaModels');
const f = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
});

const cargarCxp = async (req, res) => {
    try {
         var anio = new Date().getFullYear();
       var mes = new Date().getMonth();
       var cantDias = new Date(anio, (mes+1), 0).getDate();
        cantDias = cantDias + 1;
         
        console.log(`anio${anio} / mes ${mes} / dias ${cantDias}`);
        
        const listaCxp = await cxp.find();
        var montoT = 0;
        var inteT = 0;
        var saldoT = 0;

            listaCxp.forEach(element => {
            montoT += element.montoInicial;
            inteT += element.interes;
            saldoT += element.saldo;
        });
         montoT = f.format(montoT);
         inteT = f.format(inteT);
         saldoT = f.format(saldoT);
        const opeCxp = await caja.find({timeStamp:{$gte:new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias)}, tipo: ["prestamo", "abono","compra"]}).sort({timeStamp: -1});
        res.render('debts', { listaCxp, opeCxp, montoT, inteT, saldoT});

    } catch (error) {
        res.status(500).send('Error al cargar las cuentas por pagar');
    }   
};

const saveCxp = async (req, res) => {
    try {
        const { descripcion, tipo } = req.body;
        const fechaInicio = new Date();
        const fechaVencimiento = fechaInicio;

        const nuevaCxp = new cxp({
            descripcion,
            saldo : 0,
            montoInicial : 0,
            interes : 0,  
            tipo,
            fechaInicio ,
            fechaVencimiento
        });
        await nuevaCxp.save();
        res.redirect('/cxp');
    } catch (error) {
        res.status(500).send('Error al guardar la cuenta por pagar');
    } 
};

const saveOpeCxp = async (req, res) => {
    try {
        const { idCxp, tipo, monto, descripcion, interes, fecha, vencimiento } = req.body;    
        const cuenta = await cxp.findById(idCxp);
        let anio = new Date(fecha).getFullYear();
        let mes = new Date(fecha).getMonth();
        let dia = new Date(fecha).getUTCDate();  
      const fechaAc = new Date(anio, mes, dia).toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
      const timeStamp = new Date(anio, mes, dia).toDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
     
        if (!cuenta) {
            return res.status(404).send('Cuenta por pagar no encontrada');
        }   
        let nuevoSaldo = cuenta.saldo;
        let nuevoInteres = cuenta.interes || 0;
        let nuevoMontoInicial = cuenta.montoInicial || 0;
        let saldoT = parseFloat(monto);
        saldoT += parseFloat(interes);
        let newCajaInte = '';
        let newCajaMonto ='';

        if (tipo === 'abono') {
            nuevoSaldo -= parseFloat(saldoT); 
            nuevoInteres -= parseFloat(interes);
            nuevoMontoInicial -= parseFloat(monto);
            if (interes > 0) {
                newCajaInte = new caja({monto: interes, timeStamp, fecha: fechaAc, cod: idCxp, userCod: 10, tipo: 'interes', detalle: cuenta.descripcion});
                await newCajaInte.save();     
            }
            if (monto > 0) {
             newCajaMonto = new caja({monto: monto, timeStamp, fecha: fechaAc, cod: idCxp, userCod: 10, tipo: 'abono', detalle: cuenta.descripcion});
              await newCajaMonto.save();
            }

        } else if (tipo === 'compra' || tipo === 'prestamo') {
            nuevoSaldo += parseFloat(saldoT);
            nuevoMontoInicial += parseFloat(monto);
            nuevoInteres += parseFloat(interes ? interes : 0);
            newCajaMonto = new caja({monto: monto, timeStamp, fecha: fechaAc, cod: idCxp, userCod: 10, tipo, detalle: cuenta.descripcion +', ' + descripcion})
            await newCajaMonto.save();
         anio = new Date(vencimiento).getFullYear();
         mes = new Date(vencimiento).getMonth();
         dia = new Date(vencimiento).getUTCDate();  
         const vcto = new Date(anio, mes, dia).toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
         cuenta.fechaVencimiento = vcto;
        }    
         

        
        cuenta.saldo = nuevoSaldo;
        cuenta.interes = nuevoInteres;
        cuenta.montoInicial = nuevoMontoInicial;
        
        await cuenta.save();    
        res.redirect('/cxp');
    } catch (error) {
        res.status(500).send('Error al guardar la operacion de cuenta por pagar, ' + error );
    }   
};


module.exports = {
    cargarCxp, saveCxp, saveOpeCxp
};
const users = require("../models/userModels");
const client = require("../models/clientModels");
const setPrest = require("../models/settingsModels");
const ventas = require("../models/ventasModels");
const pagoN = require("../models/pagosModels");
const { generarJWT, verifyJWT } = require("../middleware/jwt");
const balances = require('../models/balanceModels');
const f = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 1
});



const cargarCobranza = async (req, res) => {
  console.log("cobranza");
  try {
    const token = req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    const prestamos = await ventas.find({ cobRuta: verifyToken.numRuta}).sort({nombre: 1});
    const coRu = verifyToken.numRuta;
    const diaInici = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const timeInici = new Date().toLocaleTimeString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const espe = await balances.findOne({ cobRuta:coRu, fecha:diaInici, categoria:"balance_diario"});
    const pagosActuales = await pagoN.find({cobRuta:coRu, fecha: diaInici});
    var monCobrado = 0;
    var espeValor = espe.esperado;
    var infoPagos = [];
    for (let i = 0; i < pagosActuales.length; i++) {
      const element = pagosActuales[i];
      monCobrado = element.pago + monCobrado;
      const infoPres = await ventas.findOne({_id:element.codPres});
      infoPagos.push({nombre: infoPres.nombre, pago:element.pago});
    };
    const efect = ((monCobrado / espeValor)*100).toFixed(2);
    espeValor = f.format(espeValor);
    monCobrado = f.format(monCobrado);
    const nPres = prestamos.length;
    res.render("cobranza", { prestamos, espeValor,monCobrado, efect, infoPagos,diaInici, timeInici, coRu, nPres});
    
  } catch (error) {
    
  }
};


const pagoSave = async (req, res) => {
  const { codPres, pago } = req.body;
  try {
    var fechaActual = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    
    var time = new Date();
    console.log(fechaActual);
    const prestamo = await ventas.findById({ _id: codPres });
    if (prestamo.mTotal >= pago && fechaActual !== prestamo.fechaUltPago) {
      
      var nRuta = prestamo.cobRuta; 
      const balance = await balances.findOne({cobRuta: nRuta, fecha: fechaActual});
      if (balance) {
        const pagoVa = new pagoN(req.body);
        pagoVa.fecha = fechaActual;
        pagoVa.cobRuta = prestamo.cobRuta;
        pagoVa.timeStamp = new Date().toDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
        var pNew = (prestamo.mTotal - pago).toFixed(2);
        prestamo.mTotal = pNew;
        prestamo.fechaUltPago = fechaActual;
        await ventas.findByIdAndUpdate({ _id: codPres }, prestamo);
        await pagoVa.save();
        //codigo para editar balance diario
        var venTas = await ventas.find({cobRuta: nRuta, fechaInicio: fechaActual});
        var pagosT = 0;
        var venTotal = 0;
        var monTotal = 0;
        var ganan = 0;
        venTas.forEach(element => {
          venTotal = element.monto + venTotal;
          monTotal = element.total + monTotal;
        });
        const pagos = await pagoN.find({cobRuta: nRuta, fecha: fechaActual});
        pagos.forEach(element => {
          pagosT = element.pago + pagosT;
        });
        ganan = (monTotal-venTotal).toFixed(2);
        const balanceNew = ({cobRuta: nRuta, fecha: fechaActual, nombre: balance.nombre, cobrado: pagosT.toFixed(2), esperado: balance.esperado, categoria: "balance_diario", ventas: venTotal, ganancia: ganan });
        const balanEdit = await balances.findByIdAndUpdate({_id: balance._id}, balanceNew);
        res.redirect('/cobranza');
        
      } else {
           const mensajeError = "¡No se encontro el Balance, espere a que su admin genere la planilla de cobranza!";
            res.render("error", { mensajeError });
      }
    } else {
      const mensajeError = "¡No puedes ingresar 2 o mas pagos para el mismo credito en un mismo dia, el monto del pago debe ser menor al saldo!";
      res.render("error", { mensajeError });
    }
  } catch (error) {
    res.render("error");
  }
};
const filterSem = async(req, res) =>{
  try {
    const {coRu} = req.params;
    const dia = new Date().getDay();
    console.log(dia);
    const arrayDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'Sabado'];
    const diaDeCobro = arrayDias[dia]
    const prestamos = await ventas.find({ cobRuta: coRu, diaDeCobro}).sort({nombre: 1});
    console.log('prestamos ' + prestamos);
    const diaInici = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const timeInici = new Date().toLocaleTimeString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const espe = await balances.findOne({ cobRuta:coRu, fecha:diaInici, categoria:"balance_diario"});
    const pagosActuales = await pagoN.find({cobRuta:coRu, fecha: diaInici});
    var monCobrado = 0;
    var espeValor = espe.esperado;
    var infoPagos = [];
    for (let i = 0; i < pagosActuales.length; i++) {
      const element = pagosActuales[i];
      monCobrado = element.pago + monCobrado;
      const infoPres = await ventas.findOne({_id:element.codPres});
      infoPagos.push({nombre: infoPres.nombre, pago:element.pago});
    };
    const efect = ((monCobrado / espeValor)*100).toFixed(2);
    espeValor = f.format(espeValor);
    monCobrado = f.format(monCobrado);
    const nPres = prestamos.length;
    res.render("cobranza", { prestamos, espeValor,monCobrado, efect, infoPagos,diaInici, timeInici, coRu, nPres});
    
    
  } catch (error) {
    
  }
};
const filterPosicion = async(req, res)=>{
  try {
 console.log("filter posicion");
   const diaActual = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
 
    const {coRu} = req.params;
    console.log("cobranza ruta " + coRu);
    
    const prestamos = await ventas.find({ cobRuta: coRu, fechaUltPago:{$ne:diaActual}}).sort({posicion: 1});
    res.render("cobranza", { prestamos, coRu});
  } catch (error) {
    
  }
};
const listaPagosDiarios = async(req, res) =>{
  try {
    const {coRu} = req.params;
    const diaInici = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const pagosActuales = await pagoN.find({cobRuta:coRu, fecha: diaInici});
    var monCobrado = 0;
    var infoPagos = [];
    for (let i = 0; i < pagosActuales.length; i++) {
      const element = pagosActuales[i];
      monCobrado = element.pago + monCobrado;
      const infoPres = await ventas.findOne({_id:element.codPres});
      infoPagos.push({nombre: infoPres.nombre, pago:element.pago});
    };
    monCobrado = monCobrado.toFixed(2);
    res.render("pagosListDiarios", { monCobrado, infoPagos});
    
  } catch (error) {
    
  }
};
const listaPagos = async (req, res) => {
  try {
    const { id } = req.params;
    const listPa = await pagoN.find({ codPres: id });
    const prestamo = await ventas.findOne({ _id: id });
    const array = [];
    listPa.forEach((element) => {
      const fechaString = element.fecha;
      const id = element._id;
      const pago = f.format(element.pago);
      array.push({ fechaString, id, pago });
    });
  
    return res.render("pagosList", { array, prestamo });
  } catch (error) {}
};
//funcion para guardar el esperado diario
const esperadoDiario = async(req, res) =>{
  try {
      var diA = new Date().getDay();
      if(diA !==0) {
       const fechaAc =  new Date().toLocaleDateString("es-AR", {timeZone: 'America/Buenos_Aires'});
       const ruCobro = await users.find({role:["cobrador" , "pisoDeVenta"]});
    
      var semana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "Sabado"];
      var dia = semana[diA];
     console.log("dia de semana " + dia);
    var diaD = [dia, 'todos'];
    for (let i = 0; i < ruCobro.length; i++) {
      const element = ruCobro[i];
      var nRuta = element.numRuta;
      const buscarEsperado = await balances.findOne({fecha: fechaAc, categoria: "balance_diario", cobRuta: nRuta});
      if (!buscarEsperado) {
        console.log("esperado diario for");
        var esperado = await ventas.find({ cobRuta: nRuta, diaDeCobro: diaD, mTotal:{$gt:0}});
        var espeT = 0;
        esperado.forEach(element => {
          espeT = element.cuota + espeT;
        });
        console.log("cron esperado total:" + espeT.toFixed(2));
        const balanceNew = new balances({cobRuta: nRuta,  nombre: element.nombre, fecha: fechaAc, cobrado: 0, esperado: espeT.toFixed(2), ventas: 0, vtaCtdo: 0, ganancia: 0, categoria: "balance_diario" });
        await balanceNew.save();
      }
    }; 
    console.log("Balance esperado Ok"); 
   res.redirect('/vistas/volver');
  }
  
     } 
     catch (error) {
      const mensajeError = "No se pudo generar las planillas de cobranza"
      res.render('error', {mensajeError})
     }
};
//funcion para guardar los balances diarios
const guardarBalanceDiario = async() =>{
  try {
    const diA = new Date().getDay();
    if (diA !==0){
    var fechaAc =new Date().toLocaleDateString("es-AR", {timeZone: 'America/Buenos_Aires'});
    var dia = "dia";
    const balanUser = await balances.find({fecha: fechaAc, categoria: "balance_diario"})
    console.log("balanUser --------------------------------------------------------- " + balanUser);
    for (let i = 0; i < balanUser.length; i++) {
      const element = balanUser[i];
      var nRuta = element.cobRuta;
      var pagos = await pagoN.find({cobRuta: nRuta, fecha: fechaAc});
      var venTas = await ventas.find({cobRuta: nRuta, fechaInicio: fechaAc});
      var pagosT = 0;
      var venTotal = 0;
      var monTotal = 0;
      var ganan = 0;
      venTas.forEach(element => {
        venTotal = element.monto + venTotal;
        monTotal = element.total + monTotal;
      });
      pagos.forEach(element => {
        pagosT = element.pago + pagosT;
      });
      ganan = (monTotal-venTotal).toFixed(2);
      const balanceNew = ({cobRuta: nRuta, fecha: fechaAc, nombre: element.nombre, cobrado: pagosT.toFixed(2), esperado: element.esperado.toFixed(2), categoria: "balance_diario", ventas: venTotal, ganancia: ganan });
      const balanEdit = await balances.findByIdAndUpdate({_id: element._id}, balanceNew);
    }}} 
    catch (error) {
    
  }
};


const envioTicket = async(req, res) =>{
 const {id} = req.params;
 try {
   const  pres = await ventas.findOne({_id: id});
   const pagos = await pagoN.find({codPres: id});
   const array = [];
   pagos.forEach((element) => {
     const fechaString = element.fecha;
     const id = element._id;
     const pago = f.format(element.pago);
     array.push({ fechaString, id, pago });
   });

   res.render('ticket', {pres, pagos})
 } catch (error) {
  
 }
}
const refinanciarPres = async(req,res) =>{
  try {
    const {id} = req.params;
    const press = await ventas.findById({_id:id});
    const planes = await setPrest.find();
    const arrayPlanes = [];
     planes.forEach(element => {
       const mTo = parseInt(press.mTotal * ((element.porcentaje / 100)+1));
       const cuo = parseInt(mTo / element.cuotas);
       const plan = element.plan;
       const cuotas = element.cuotas;
       const porcentaje = element.porcentaje;
       const categoria = element.categoria;
      arrayPlanes.push({plan: plan,cuotas: cuotas,porcentaje: porcentaje,categoria: categoria, mTotal: mTo, cuota: cuo, _id: element._id});
    });
    res.render('refinanciar',{arrayPlanes, press});

  } catch (error) {
    res.render('error');
  }
};
const saveRefinanciarPres = async(req, res) =>{
  try {
    const {idPres, monto, detalle, diaDeCobro, planId} = req.body;
    const planInf = await setPrest.findById({_id: planId});
    const presMod = await ventas.findById({_id: idPres});
    const mTo = parseInt(monto * ((planInf.porcentaje / 100)+1));
    const cuo = parseInt(mTo / planInf.cuotas);
    var fechaV = new Date();
    var fechaVencimiento = "";
    if (planInf.plan === "diario") {
      var DiaDom = parseInt(planInf.cuotas/6);
       fechaVencimiento = new Date(fechaV.setDate(fechaV.getDate() + (planInf.cuotas + DiaDom)));
     } else {
      fechaVencimiento = new Date(fechaV.setDate(fechaV.getDate() + (planInf.cuotas * 7)));
     }
    presMod.detalle = detalle;
    presMod.fechaFinal = fechaVencimiento.toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    presMod.DateFinal = fechaVencimiento;
    presMod.monto= monto;
    presMod.mTotal= mTo;
    presMod.cuotas= planInf.cuotas;
    presMod.plan= planInf.plan;
    presMod.cuota= cuo;
    presMod.diaDeCobro= diaDeCobro;
    const editPres = await ventas.findByIdAndUpdate({_id: idPres}, presMod );
    const mensaje = "¡Credito Refinanciado Con Exito!";
     res.render('refinanciar', {mensaje});
  } catch (error) {
    
  }
};

const note = async(req, res)=>{
  try {
    const {id} = req.params;
    const press = await ventas.findOne({_id: id});
    res.render('nota', {press});
  } catch (error) {
    
  }
};
const saveNote = async(req, res)=>{
  try {
    const {id} = req.params;
    const {nota, cobRuta} = req.body;
    const token =  req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    var rol = verifyToken.role;
    const fecha = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Buenos_Aires'});
    var not = `${fecha} - ${nota}`;
    var usuario = verifyToken.nombre;
    console.log("rol " + rol);
     var prestamos ="";
switch (rol) {
  case 'cobrador':
    const newNota = await ventas.findOneAndUpdate({_id: id}, {notaCobrador: not});
     res.redirect('/cobranza');
    break;
    case 'admin':
     const newNotAd= await ventas.findOneAndUpdate({_id: id}, {nota: not});
     prestamos = await ventas.find({cobRuta}).sort({nombre: 1});
     
      usuario = await users.findOne({numRuta: cobRuta}); 
      return res.render('cobranzaAdmin', {prestamos, usuario});
    break;
    case 'supervisor':
      const newNotAdd= await ventas.findOneAndUpdate({_id: id}, {nota: not});
      prestamos = await ventas.find({cobRuta}).sort({nombre: 1});
     
      usuario = await users.findOne({numRuta: cobRuta}); 
      return res.render('cobranzaAdmin', {prestamos, usuario});
    break;

  default:
    break;
}
  } catch (error) {
    
  }
};
const posicionNumber = async(req, res) =>{
  try {
    const {id} = req.params;
    const pres = await ventas.findById({_id: id});
    res.render('posicionPres', {pres});
  } catch (error) {
    
  }
};
const savePosicion = async(req, res)=>{
  try {
    const {id, number, cobRu} = req.body;
    var num1 = parseInt(number);
    console.log("save posicion " );
    const prestamosEditar = await ventas.find({cobRuta:cobRu, posicion:{$gte:num1}}).sort({posicion: 1});
    console.log("number " + num);
    console.log(num);
    var num = num1 + 1;
    
    for (let i = 0; i < prestamosEditar.length; i++) {
      const element = prestamosEditar[i];
      var n = i + num;
      console.log(n);
      
      var posEdit = await ventas.findOneAndUpdate({_id: element._id}, {posicion: n});
    }
    const presEdit =await ventas.findOneAndUpdate({_id: id}, {posicion: num1});
    const prestamos = await ventas.find({cobRuta: cobRu}).sort({posicion: 1});
    const usuario = cobRu;
    
    res.render('cobranza', {prestamos, usuario});
  } catch (error) {
    
  }
}
module.exports = { cargarCobranza, pagoSave, listaPagos, listaPagosDiarios, guardarBalanceDiario, esperadoDiario, envioTicket, refinanciarPres, saveRefinanciarPres, filterSem, note, saveNote, posicionNumber, savePosicion, filterPosicion};

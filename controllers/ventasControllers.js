const users = require("../models/userModels");
const setPrest = require('../models/settingsModels');
const client = require("../models/clientModels");
const ventas = require('../models/ventasModels');
const historyVentas = require('../models/historyVentas');
const product = require('../models/productModels');
const balance = require('../models/balanceModels');
const transf = require("../models/transfModels");
const setValores = require('../models/settingValoresModels');
const cajaOp = require('../models/cajaModels');
const { generarJWT, verifyJWT} = require('../middleware/jwt');
const f = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
});

const cargarVentas = async(req, res) => {
    const fechaHoy = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
     const usuariosVent = await users.find({role: ['cobrador','vendedor', 'pisoDeVenta']});
     const usuariosCob = await users.find({role: ['cobrador', 'pisoDeVenta']});
     const productos = await product.find().sort({nombre: 1});
     const planPrest = await setPrest.find({categoria: 'prestamo'}).sort({porcentaje: 1});
     const planProd = await setPrest.find({categoria: 'financiamiento'}).sort({porcentaje: 1});
     const ventasT = await ventas.find().sort({timeStamp: -1}).limit(20);
     const ventasCont = await historyVentas.find({categoria: "contado"}).sort({timeStamp: -1}).limit(20);
     return res.render('ventas', {usuariosVent,usuariosCob, planPrest, planProd, ventasT, ventasCont, productos});
}
//cargar ventas totales en el mes
const fecthVentasMes = async(req, res) =>{
const {mesInp, anioInp} = req.body;
    var anio = anioInp || new Date().getFullYear();
    var mes = mesInp || new Date().getMonth();
    var m = parseInt(mes) + 1;

     
     var cantDias = new Date(anio,m,0);
     cantDias = cantDias.getDate();

     const ventasFina = await historyVentas.find({categoria:"financiamiento", timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias,23,59,59,0)}}).sort({timeStamp: -1});
    const ventasCont = await historyVentas.find({categoria: "contado",timeStamp:{$gte: new Date(anio,mes,1), $lte: new Date(anio,mes,cantDias,23,59,59,0)} }).sort({timeStamp: -1});
    
    res.render('historialVentas', {ventasFina, ventasCont, anio, mes: m});
  }



//cargar ventas especificas de usuarios como vendedore y cobradores
const cargarVenCob = async(req, res) =>{
  const {nRuta} = req.params;
  res.send('ssss')
}

const preCotizar = async(req, res) =>{
  try {
     const cot = req.body;
    console.log(cot);
    var mensajeError = '';
    const fecha = cot.fecha;
    const anio = new Date(fecha).getFullYear();
    const mes = new Date(fecha).getMonth();
    const dia = new Date(fecha).getUTCDate();
    const fechaVent = new Date(anio, mes, (dia + 1)).toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const cliente = await client.findOne({dni:cot.dni});
    const balanCEDiario = await balance.findOne({cobRuta: cot.cobRuta, fecha: fechaVent});
    console.log("fecha de venta " + cot.fecha);
    console.log("balance encontrado " + balanCEDiario);
    if (!cliente) {
      mensajeError = '¡El Cliente NO existe en la DATA BASE!';
      res.render('error', {mensajeError});
    }
     if (balanCEDiario) {
       const arrayCod = [];
         if (cot.codProd == "prestamo"){
          const planCot = await setPrest.findById({_id:cot.planId});
        const mTotal = (cot.monto * ((planCot.porcentaje / 100)+1)).toFixed(2);
        const cuota = (mTotal / planCot.cuotas).toFixed(2);
        arrayCod.push({"cod": cot.codProd, "cant": 1});
        res.render('confirmarVenta', {cot, planCot, cuota, mTotal, cliente, arrayCod});
         }
         else{
        const codProducts = cot.codProd;
        if (Array.isArray(codProducts)) {
          for (let i = 0; i < codProducts.length; i++) {
            const element = codProducts[i];
            console.log(element);
            
            var prod = await product.findOne({cod: element});
            console.log("producto");
            console.log(prod);
            arrayCod.push({"cod":element,"nombre": prod.nombre});
          };  
          res.render('cantProdVenta', {cot,arrayCod, cliente});
        }
        else{
          var prod = await product.findOne({cod: codProducts});
          arrayCod.push({"cod":codProducts, "nombre": prod.nombre});
          precio= prod.precio;
          res.render('cantProdVenta', {cot,arrayCod, cliente});
        }
         }
     }
  } catch (error) {
    
  }
}



const cotizarPlan = async(req, res) => {
  try {
    const cot = req.body;
    
    var mensajeError = '';
    const fecha = cot.fecha;
    const anio = new Date(fecha).getFullYear();
    const mes = new Date(fecha).getMonth();
    const dia = new Date(fecha).getUTCDate();
    const fechaVent = new Date(anio, mes, (dia + 1)).toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const cliente = await client.findOne({dni:cot.dni});
    const balanCEDiario = await balance.findOne({cobRuta: cot.cobRuta, fecha: fechaVent});
    console.log("fecha de venta " + cot.fecha);
    console.log("balance encontrado " + balanCEDiario);
    if (!cliente) {
      mensajeError = '¡El Cliente NO existe en la DATA BASE!';
      res.render('error', {mensajeError});
    }
    if (balanCEDiario) {
      console.log("cotizar producto");
      //array con codigos de productos o prestamo
      const arrayCod = [];
      console.log(cot);
      if (cot.codProd == "prestamo") {
        const planCot = await setPrest.findById({_id:cot.planId});
        const mTotal = (cot.monto * ((planCot.porcentaje / 100)+1)).toFixed(2);
        const cuota = (mTotal / planCot.cuotas).toFixed(2);
        arrayCod.push({"cod": cot.codProd});
        res.render('confirmarVenta', {cot, planCot, cuota, mTotal, cliente, arrayCod});
      }
      else{
        
        const valores = await setValores.findOne();
        const codProducts = cot.codProd;
        var precio = 0;
        if (Array.isArray(codProducts)) {
          console.log("is array");
          
          for (let i = 0; i < codProducts.length; i++) {
            const element = codProducts[i];
            
            var prod = await product.findOne({cod: element});
           var el = element;
            
            var cantProd = req.body[element];
            console.log("elemento: " + cantProd);
            
            console.log("producto cantidad: " + cantProd);
            console.log(prod);
            precio = ((prod.precio) * cantProd) + precio;
            console.log(precio);
            arrayCod.push({"cod":element,"nombre": prod.nombre, "precio": prod.precio, "cant": cantProd, "Total": (prod.precio * cantProd)});
            console.log("array productos " + arrayCod);
          };  
        }
        else{
          var prod = await product.findOne({cod: codProducts});
          var cantProd = req.body[codProducts];
          precio= prod.precio * cantProd;
          arrayCod.push({"cod":codProducts, "nombre": prod.nombre, "precio": prod.precio, "cant": cantProd, "Total": (prod.precio * cantProd) });
        }

        
        const precioT = (precio * valores.dolar) * ((valores.porcentaje / 100) +1);
        const des = (cot.descuento / 100);
    
        const planCot = await setPrest.findById({_id:cot.planId});
        const mTotal = ((precioT * ((planCot.porcentaje / 100)+1))-(des * (precioT * ((planCot.porcentaje / 100)+1)))).toFixed(2);
        const cuota = (mTotal / planCot.cuotas).toFixed(2);
        res.render('confirmarVenta', {cot, planCot, cuota, mTotal, cliente, arrayCod});
        
      }
     }
    else{
      mensajeError = '¡La fecha de venta ingresada no es permitida!, elija una fecha que tenga un BALANCE DIARIO generado en esa ruta de cobro';
      res.render('error', {mensajeError});
    }
    
  } catch (error) {
    res.render('error');
  }
};


const guardarVentas = async(req,res) => {
try {
  //jwt para determinar el usuario que hace la operacion
   const token =  req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    const rol = verifyToken.role;
    const nRuta = verifyToken.numRuta;
    //.........................
  const {fecha} = req.body;
  const newVenta = new ventas(req.body);
  const ade = newVenta.adelanto;
  const cdp = req.body.codProd;
  console.log("New venta......................");
  console.log(cdp);
  newVenta.total = newVenta.mTotal;
  newVenta.mTotal = newVenta.mTotal - newVenta.adelanto;
 console.log("codigos productos  ");
 console.log(cdp);
  const cliente = await client.findOne({dni: newVenta.dni});
  newVenta.geolocalizacion = cliente.geolocalizacion;
  const anio = new Date(fecha).getFullYear();
  const mes = new Date(fecha).getMonth();
  const dia = new Date(fecha).getUTCDate();
  const fechaAc = new Date(anio, mes, (dia + 1)).toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  const timeSt = new Date(anio, mes, dia).toDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  var fechaV  = new Date(anio, mes, dia);//.toDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  var fechaVencimiento = "";
  if (newVenta.plan === "diario") {
    var DiaDom = parseInt(newVenta.cuotas/6);
    fechaVencimiento = new Date(fechaV.setDate(fechaV.getDate() + (newVenta.cuotas + DiaDom)));
  } else {
    fechaVencimiento = new Date(fechaV.setDate(fechaV.getDate() + (newVenta.cuotas * 7)));
  }
  newVenta.timeStamp =  new Date(anio, mes, dia).toDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  newVenta.fechaInicio = fechaAc;
  newVenta.fechaFinal = fechaVencimiento.toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  newVenta.DateFinal= fechaVencimiento;
  var montGanancia = newVenta.total - newVenta.monto;
  const balan = await balance.findOne({cobRuta: newVenta.cobRuta, fecha: fechaAc});
  balan.ventas = balan.ventas + newVenta.monto;
  balan.ganancia = balan.ganancia + montGanancia;
  await balance.findByIdAndUpdate(balan._id, balan);
  await newVenta.save();
  
  if (newVenta.venRuta !== 1) { 
    if (newVenta.categoria == "prestamo") {
      newVenta.monto = newVenta.monto;
    }
    const newHistoryVenta = new historyVentas({
      nombre: newVenta.nombre,
      dni: newVenta.dni,
      venRuta: newVenta.venRuta,
      cobRuta: newVenta.cobRuta,
      codProd: newVenta.codProd,
       user: nRuta,
      detalle: newVenta.detalle,
      mTotal: newVenta.total,
      descuento: newVenta.descuento,
      categoria: newVenta.categoria,
      plan: `${newVenta.plan} / Cuotas: ${newVenta.cuotas} / Cuota: ${newVenta.cuota}`,
      fechaInicio: fechaAc
    });
    await newHistoryVenta.save();
  }
  //operacion para sumar el ingreso de un adelanto cuando es venta de productos
 //....................................................
  
  if (ade > 0) {
    console.log("dentro delif adelantos");
    
    switch (rol) {
        case "pisoDeVenta":
          const balan = await balance.findOne({cobRuta: nRuta, fecha: fechaAc});
        const Tt = (((balan.vtaCtdo)*1) + ((newVenta.adelanto)*1)).toFixed(2);
        balan.vtaCtdo = Tt;
       const newBalan = await balance.findByIdAndUpdate({_id: balan._id}, balan);
          break;
         case "admin":
              console.log("dentro delif adelantos / case");
            const newCaja = new cajaOp({monto: newVenta.adelanto, fecha: fechaAc, userCod: newVenta.cobRuta, tipo: "ingreso", detalle: newVenta.detalle, timeStamp: new Date()});
            await newCaja.save();
          break;
        default:
          break;
       }
  }
  //operacion restar stock de productos
 //....................................................
  var prod= 0;
  if (Array.isArray(cdp)) {
    for (let i = 0; i < cdp.length; i++) {
      const element = cdp[i]; 
      prod = await product.findOne({cod: element});
     var cantProd = req.body[element];

      prod.stock = prod.stock - cantProd;
      await product.findByIdAndUpdate({_id: prod._id}, prod);
    }
  } else if (cdp != 'prestamo') { 
      prod = await product.findOne({cod: cdp});
      var cantProd = req.body[cdp];
      prod.stock = prod.stock - cantProd;
      await product.findByIdAndUpdate({_id: prod._id}, prod); 
    } 
    //funcion para crear operacion de caja con decuento de saldo anterior
    if (req.body.salAnt > 0) {
      const newCaja = new cajaOp({monto: req.body.salAnt, fecha: fechaAc, userCod: nRuta, tipo: "rendicion", detalle: `Dto. por renov.: ${newVenta.nombre}`, timeStamp: timeSt});
      await newCaja.save();
    }
  
  res.redirect('/ventas');
  } catch (error) {
    const mensajeError = error;
    res.render('error', {mensajeError});
}
};

const preCotizarCont = async(req, res) =>{
  try {
    const cot = req.body;
    const codProducts = cot.codProd;
    const cliente = await client.findOne({dni:cot.dni});
     const arrayCod = [];
     if (Array.isArray(codProducts)) {
          for (let i = 0; i < codProducts.length; i++) {
            const element = codProducts[i];
            console.log(element);
            
            var prod = await product.findOne({cod: element});
            arrayCod.push({"cod":element,"nombre": prod.nombre});
          };  
          res.render('cantProdVentCont', {cot,arrayCod, cliente});
        }
        else{
          var prod = await product.findOne({cod: codProducts});
          arrayCod.push({"cod":codProducts, "nombre": prod.nombre});
          precio= prod.precio;
          res.render('cantProdVentCont', {cot,arrayCod, cliente});
        }

  } catch (error) {
    
  }
} 

const cotizarContado = async(req, res)=>{
try {
   const cot = req.body;
    const cliente = await client.findOne({dni:cot.dni});
   const codProducts = cot.codProd;
   const valores = await setValores.findOne();
   var precio = 0;
   const arrayCod = [];
   if (Array.isArray(codProducts)) {
    console.log("array");
    
          for (let i = 0; i < codProducts.length; i++) {
            const element = codProducts[i];
            var prod = await product.findOne({cod: element}); 
            const cantProd = req.body[element];
            precio = (prod.precio * cantProd) + precio;
            console.log(arrayCod);
            
            arrayCod.push({"cod":element, "nombre": prod.nombre, "precio": prod.precio, "cant": cantProd, "Total": (prod.precio * cantProd) });
          }
        }
        else{
          var prod = await product.findOne({cod: codProducts});
          const cantProd = req.body[codProducts];
          precio= prod.precio * cantProd;
          arrayCod.push({"cod":codProducts, "nombre": prod.nombre, "precio": prod.precio, "cant": cantProd, "Total": (prod.precio * cantProd) });
        }
        console.log("corizar contado");
        
        const precioT = (precio * valores.dolar) * ((valores.porcentaje / 100) +1);
        const des = (cot.descuento / 100);
        const precioTotal = (precioT - (des * precioT)).toFixed(2);
     
   
        console.log("precio: " + precioTotal);
       
   res.render('confirmarVenContado', {precioTotal, cliente, cot, arrayCod});
} catch (error) {
  var mensajeError = "Seleccione un producto"
   res.render("error", {mensajeError})
}
};

const guardarVentasContado = async(req, res)=>{
  try {
    const vent = req.body;
    const m = ((vent.mT)*1).toFixed(2);
    const cdp = vent.codProd;
   var detalle = "";
  const fechaAc = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
  const valores = await setValores.findOne();

    const token =  req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    const rol = verifyToken.role;
    const nRuta = verifyToken.numRuta;
     var cantProd = 0;
     var arrayProdBoleta = [];
     var totalTo = 0;
      if (Array.isArray(cdp)) {
      for (let i = 0; i < cdp.length; i++) {
        const element = cdp[i];
        cantProd = req.body[element];
        var prod = await product.findOne({cod: element});
        const precioT = (prod.precio * valores.dolar) * ((valores.porcentaje / 100) +1);
        prod.stock = prod.stock - cantProd;
        var precio = f.format(precioT);
        var total= f.format((precioT * cantProd));
        await product.findByIdAndUpdate({_id: prod._id}, prod);
        totalTo = totalTo + (precioT * cantProd);
        arrayProdBoleta.push({"cod":element,"nombre": prod.nombre,"garantia":prod.garantia ,"precio": precio, "cant": cantProd, "total": (total) });
        detalle = detalle + "Cant: " + cantProd + ", "+ prod.nombre + ", Cod: " + prod.cod + " || ";
        
      } } else { 
        var prod = await product.findOne({cod: cdp});
        cantProd = req.body[cdp];
        const precioT = (prod.precio * valores.dolar) * ((valores.porcentaje / 100) +1);
        prod.stock = prod.stock - cantProd;
        var precio = f.format(precioT);
        var total= f.format((precioT * cantProd));
        prod.stock = prod.stock - cantProd;
        arrayProdBoleta.push({"cod":cdp,"nombre": prod.nombre,"garantia":prod.garantia ,"precio": precio, "cant": cantProd, "total": total});
         detalle = "Cant: " + cantProd + ", "+ prod.nombre + ", Cod: " + prod.cod + " || ";
         totalTo = (precioT * cantProd);
        console.log("new prod");
        await product.findByIdAndUpdate({_id: prod._id}, prod); 
      } 
      
      const newHistoryVenta = new historyVentas({
        nombre: vent.nombre,
        dni: vent.dni,
        venRuta: vent.venRuta,
        codProd: vent.codProd,
        detalle: detalle,
        mTotal: m,
        descuento: vent.descuento,
        categoria: "contado",
        plan: vent.plan,
        fechaInicio: fechaAc,
        user: nRuta
      });
      await newHistoryVenta.save();
      
      switch (rol) {
   
            case "pisoDeVenta":
           const balan = await balance.findOne({cobRuta: nRuta}).sort({timeStamp: -1});
           console.log("balance encontrado:" + balan);
           
         const Tt = (((balan.vtaCtdo)*1) + ((vent.mT)*1)).toFixed(2);
         balan.vtaCtdo = Tt;
        const newBalan = await balance.findByIdAndUpdate({_id: balan._id}, balan);
           break;
        case "admin":
           const newCaja = new cajaOp({monto: m, fecha: fechaAc, userCod: nRuta, tipo: "ingreso", detalle: detalle, timeStamp: new Date()});
           await newCaja.save();
         break;
       default:
         break;
      }
     //creamos la transferencia si es que hay monto
        if (req.body.transfMonto && req.body.transfFecha) {
               const transfNew = new transf();
                    transfNew.codPres = "VENTA CONTADO";
                    transfNew.cobRuta = nRuta;
                    transfNew.nombre = vent.nombre;
                    transfNew.dni = vent.dni;
                    transfNew.transfFecha = req.body.transfFecha;
                    transfNew.fecha = fechaAc;
                    transfNew.monto = req.body.transfMonto;
                    await transfNew.save();
                }

      var subTotal = f.format(totalTo);
      var des = (vent.descuento / 100) * totalTo;
      var totalT = f.format(totalTo - des);
      des = f.format(des);
     console.log("array productos boleta");
     console.log(newHistoryVenta);
    res.render('boleta', {newHistoryVenta,fechaAc, totalT, subTotal, arrayProdBoleta, des});
  } catch (error) {
    var mensajeError = error + "Error al guardar la venta";
    res.render('error', {mensajeError});
  }
};





module.exports = {preCotizar, fecthVentasMes, preCotizarCont, cotizarPlan, cotizarContado, cargarVentas, guardarVentasContado, guardarVentas, cargarVenCob};

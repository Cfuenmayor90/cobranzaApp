const users = require("../models/userModels");
const histVentas = require("../models/historyVentas");
const ventas = require("../models/ventasModels");
const balances = require("../models/balanceModels");
const { generarJWT, verifyJWT} = require('../middleware/jwt');
const { validationResult } = require("express-validator");
require('dotenv').config();
const bcrypt = require('bcrypt');
const { now } = require("mongoose");

const secretKey = process.env.CLAVE_JWT;


const crearUsuario = async (req, res) => {

  try {
    var { nombre, dni, password, role, direccion, telefono } = req.body;
    
    let usuarioNuevo = await users.findOne({ dni });
    if (usuarioNuevo) {
      mensajeError = 'Usuario existente';
      return res.render('error', {mensajeError});
    }
    //creamos el usuario en la base de datos
    const userNumRuta = users.findOne().sort({numRuta: -1});
  var nRuta = "";
if (role == "vendedor") {
   nRuta = userNumRuta.numRuta || 200;
  console.log("vendedor" + userNumRuta);
} else {
   nRuta = userNumRuta.numRuta || 100;
  console.log("cobrador");
  console.log("cobrador" + userNumRuta);
}

     const nuRuta = nRuta + 1;
    usuarioNuevo = new users(req.body);
    usuarioNuevo.numRuta = nuRuta;
    const salt = bcrypt.genSaltSync(10);
    usuarioNuevo.password = bcrypt.hashSync(password, salt);
    await usuarioNuevo.save();
    res.redirect('/vistas/usuarios');
    
  } catch (error) {
    const mensajeError = 'Error en la Data Base';
    return res.render('error', {mensajeError});
  }
};

const buscarUsuario = async (req, res) => {
  try {
    const {dni} = req.body;
    const usuarioBuscado = await users.findOne({dni});
    const usuarios = await users.find();
    if (usuarioBuscado) {
      return res.render('usuarios', {usuarioBuscado, usuarios});
    } else {
      const mensajeBuscar = '¡El Usuario No Existe En La Base De Datos!'
      return res.render('usuarios', {usuarios, mensajeBuscar});
    }
  } catch (error) {
    const mensajeError = 'Error en la Data Base';
    return res.render('error', {mensajeError});
  }
};

const validarIngresoUsuario = async (req, res) => {
  const { dni, password } = req.body;

  try {
     let userIngreso = await users.findOne({dni});
     if (!userIngreso) {
      mensajeError = 'Usuario Inexistente';
      return res.render('error', {mensajeError});
     };

     const valiPassword = bcrypt.compareSync(password, userIngreso.password);

     if(valiPassword){
      const nombre = userIngreso.nombre;
      const nRuta = userIngreso.numRuta;
     
      const token = await generarJWT(userIngreso);
      res.cookie('token', token, {
          httpOnly: true
      });
    
      const rol = userIngreso.role;
      var anio = new Date().getFullYear();
      var mes = new Date().getMonth();
      var cantDias = new Date(anio, (mes+1), 0).getDate();
      var dia = new Date().getDate();
      switch (rol) {
        case 'admin':
          const fecha = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Buenos_Aires'});
          const rutas = await balances.find({fecha});
          return res.render("principal", { nombre, nRuta, rutas});
          break;
        case 'cobrador':
             const presVencidos = await ventas.find({cobRuta: nRuta, DateFinal:{$lte: new Date(anio,mes,dia)}});
             const hVentas = await histVentas.find({venRuta:userIngreso.numRuta, timeStamp:{$gte: new Date(anio, mes, 0), $lte: new Date(anio, mes, cantDias)}});
              console.log(presVencidos);
             return res.render("principalCobrador", { nombre, nRuta, hVentas, presVencidos});
          break;
          case 'pisoDeVenta':
          const pVencidos = await ventas.find({cobRuta: nRuta, DateFinal:{$lte: new Date(anio,mes,dia)}});
          const hisVentas =  await histVentas.find({venRuta:userIngreso.numRuta, timeStamp:{$gte: new Date(anio, mes, 0), $lte: new Date(anio, mes, cantDias)}});
          console.log(pVencidos);
            return res.render("pisoDeVenta", {nombre, nRuta, pVencidos, hisVentas});
         break;
        case 'vendedor':
          const Ventas = await histVentas.find({venRuta:userIngreso.numRuta, timeStamp:{$gte: new Date(anio, mes, 0), $lte: new Date(anio, mes, cantDias)}});
              
          return res.render("principalVendedor", { nombre, Ventas, nRuta});

          break;
        default:
          mensajeError = 'Role Inexistente';
          return res.render('error', {mensajeError});
          break;
      }
     }
     mensajeError = 'Password Incorrecto';
    return res.render('errorToken', {mensajeError});
     
  } catch (error) {
    mensajeError = 'Error en Data Base ';
    return res.render('error', {mensajeError});
  };

};

const checkRole = (roles) => async (req, res, next) => {
  try {
      const token =  req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
      const verifyToken = await verifyJWT(token); // Verificar el token JWT
      if (!verifyToken) {
          // Si el token no es válido o no existe
          res.clearCookie('token'); // Borrar la cookie del token
          mensajeError = 'Tu sesion ha caducado'
          res.render('errorToken', {mensajeError})
          
      } else {
          // Si el token es válido
          const userDetail = users.findOne(verifyToken.dni); // Buscar en la base de datos el detalle del usuario correspondiente al ID almacenado en el token
          req.user = userDetail; // Asignar el detalle del usuario al objeto req para que esté disponible en los siguientes middlewares o controladores
          const role = verifyToken.role; // Obtener el rol del usuario
          if ([].concat(roles).includes(role)) {
              // Si el rol del usuario está incluido en el arreglo de roles permitidos
              next(); // Pasar al siguiente middleware o controlador
          } else {
              // Si el rol del usuario no está incluido en el arreglo de roles permitidos
              res.status(409);
              res.render('error', { mensajeError: 'Usted no cuenta con los permisos suficientes para acceder a esta página' }); // Mostrar un mensaje de error indicando que el usuario no tiene los permisos suficientes
          }
      }
  } catch (e) {
      // Si ocurre algún error durante el proceso de autenticación o autorización
      res.status(409);
      mensajeError = 'Error en token de usuario'
      res.render('errorToken', {mensajeError})
      
  }
};

const logOut = (req, res) => {
    res.clearCookie('token');
    res.render('index');
};

const volverPrin = async (req, res) => {

  try {
    
   const token =  req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    console.log("token" + token);
    console.log("very" + verifyToken);
    
    if (!verifyToken) {
      res.clearCookie('token'); // Borrar la cookie del token
      mensajeError = 'Tu sesion ha caducado'
      res.render('errorToken', {mensajeError})
      
    } else {
      const rol = verifyToken.role;
      const nombre = verifyToken.nombre;
      const nRuta = verifyToken.numRuta;
      const fecha = new Date().toLocaleTimeString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
      var anio = new Date().getFullYear();
      var mes = new Date().getMonth();
      var cantDias = new Date(anio, (mes+1), 0).getDate();
      var dia = new Date().getDate();
      
      switch (rol) {
        case 'admin':
          const fecha = new Date().toLocaleDateString("es-AR", {timeZone: 'America/Buenos_Aires'});
          const rutas = await balances.find({fecha});
         res.render("principal", {fecha, nombre, rutas});
          break;
        case 'cobrador':
          const presVencidos = await ventas.find({cobRuta: nRuta, DateFinal:{$lte: new Date(anio,mes,dia)}});
          const hVentas = await histVentas.find({venRuta: nRuta, timeStamp:{$gte: new Date(anio, mes, 0), $lte: new Date(anio, mes, cantDias)}});
           console.log(presVencidos);
          res.render("principalCobrador", { nombre, nRuta, hVentas, presVencidos});
          break;
        case 'pisoDeVenta':
          const pVencidos = await ventas.find({cobRuta: nRuta, DateFinal:{$lte: new Date(anio,mes,dia)}});
          const hisVentas =  await histVentas.find({venRuta:nRuta, timeStamp:{$gte: new Date(anio, mes, 0), $lte: new Date(anio, mes, cantDias)}});
          console.log(pVencidos);
            return res.render("pisoDeVenta", {nombre, nRuta, pVencidos, hisVentas});
         break;
          case 'vendedor':
            const Ventas = await histVentas.find({venRuta:userIngreso.numRuta, timeStamp:{$gte: new Date(anio, mes, 0), $lte: new Date(anio, mes, cantDias)}});
      
            return res.render("principalVendedor", { nombre, Ventas, nRuta});
            break;
        default:
          mensajeError = 'Role Inexistente';
           res.render('error');
          break;
    } 
    }
} catch (error) {
  mensajeError = 'No cuentas con autorizacion'
   res.render('errorToken', {mensajeError})
}};

const cargarUsuarios = async(req, res) => {
 try {
   const usuarios = await users.find();
   res.render('usuarios', {usuarios});
 } catch (error) {
  return res.render('error');
 }};

 const editUserGet = async(req, res) =>{
  try {
    const id = req.params.id;
    const usuario = await users.findById(id).lean();
    res.render('usuarioEdit', {usuario});
  } catch (error) {
    return res.render('error');
  }};
  const editUserPost = async(req, res) =>{
    try {
      const {id}= req.params;

      usuarioNuevo = req.body;
      salt = bcrypt.genSaltSync(10);
      usuarioNuevo.password = bcrypt.hashSync(req.body.password, salt);
     await users.findByIdAndUpdate({_id:id}, usuarioNuevo);
     res.redirect('/vistas/usuarios');
    } catch (error) {
      return res.render('error');
    }};


  const deleteUser = async(req, res) =>{
     const {id} = req.params;
     await users.findByIdAndDelete(id);
     res.redirect('/vistas/usuarios');
  };


module.exports = {
  validarIngresoUsuario,
  crearUsuario,
  checkRole,
  logOut,
  volverPrin, 
  cargarUsuarios,
  editUserGet,
  editUserPost,
  deleteUser,
  buscarUsuario
};

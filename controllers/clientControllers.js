const client = require("../models/clientModels");
const {verifyJWT} = require("../middleware/jwt");
const { validationResult } = require("express-validator");

const crearCliente = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    console.log("Tenemos errores de validacion");
    return res.send("<h1>Error en los datos ingresados</h1>");
  }
  const {
    nombre,
    dni,
    rubro,
    localidadComercial,
    dirComercial,
    localidadParticular,
    dirParticular,
    celular,
    telefono,
    email
  } = req.body;
  try {
    console.log('Crear cliente');
    var clienteNuevo = await client.findOne({dni});
    var clientes = await client.find().sort({timeStamp: -1}).limit(10);
    if (clienteNuevo) {
      var mensaje = '¡El Cliente Ya Existe!';
      return res.render('clientes', {mensaje, clientes});
    }
    else{
      clienteNuevo = new client(req.body);
      await clienteNuevo.save();
          mensaje = '¡Cliente Guardado Con Exito!';
          clientes = await client.find().sort({timeStamp: -1}).limit(10);
       return res.render('clientes', {clientes, mensaje});

    }
  } catch (error) {
    const mensajeError = '¡Error En La Base De datos!'
    return res.render('error', {mensajeError});
  }
};

const buscarCliente = async(req, res) => {
  try {
    const {dni} = req.body;
    console.log('dni cliente ' + dni);
    const clienteBuscado = await client.findOne({dni});
    const clientes = await client.find().sort({timeStamp: -1}).limit(10);
    console.log(clienteBuscado);
    if (clienteBuscado) {
      return res.render('clientes', {clienteBuscado, clientes});
    } else {
      const mensajeBuscar = '¡El Cliente No Existe En La Base De Datos!'
      return res.render('clientes', {clientes, mensajeBuscar});
    }
  } catch (error) {
    const mensajeError = 'Error en la Data Base';
    return res.render('error', {mensajeError});
  }

};

const cargarClientes = async(req, res) =>{
  try {
    const token =  req.cookies.token;
    const verifyToken = await verifyJWT(token);
    const role = verifyToken.role;
    const clientes = await client.find().sort({timeStamp: -1}).limit(10);
     return res.render('clientes', {clientes, role});
  } catch (error) {
    console.log(error);
  }};

  const editClientGet = async(req, res) =>{
    try {
      const {id} = req.params;
      const cliente = await client.findById(id);
      res.render('clienteEdit', {cliente});
      
    } catch (error) {
      
    }};
  const editClientPost = async(req, res) =>{
   try {
    const {id} = req.params;
    const clienteEdit = req.body;
    await client.findByIdAndUpdate({_id:id}, clienteEdit);
    res.redirect('/vistas/clientes');
    
   } catch (error) {
    
   }

  }
  const deleteClient = async(req, res) =>{
     const {id} = req.params;
     await client.findByIdAndDelete(id);
     res.redirect('/vistas/clientes');
  }

module.exports = {
  crearCliente,
  cargarClientes,
  editClientGet,
  editClientPost,
  deleteClient,
  buscarCliente
};

const client = require("../models/clientModels");
const ventas = require('../models/ventasModels');
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
    const dniCli = clienteEdit.dni;
    console.log("dni client "+ dniCli);
    await client.findByIdAndUpdate({_id:id}, clienteEdit);
    //buscamos las ventas activas para actualizar la info
    const presEditData = await ventas.find({dni:dniCli});
    for (let i = 0; i < presEditData.length; i++) {
      const element = presEditData[i];
      element.dni = clienteEdit.dni;
      element.nombre = clienteEdit.nombre;
      element.celular = clienteEdit.celular;
      element.geolocalizacion= clienteEdit.geolocalizacion;
      element.direccion = `${clienteEdit.localidadComercial}/ ${clienteEdit.dirComercial}`;
      await ventas.findByIdAndUpdate({_id: element._id}, element);
      
    }
    console.log("prestamos " + presEditData);
    
    res.redirect('javascript:history.back()');
    
   } catch (error) {
    
   }

  }
  const deleteClient = async(req, res) =>{
     const {id} = req.params;
     await client.findByIdAndDelete(id);
     res.redirect('/vistas/clientes');
  };

  const listClient = async(req, res)=>{
    try {
      const clientes = await client.find().sort({nombre: 1});
      const cant = clientes.length;
      res.render('clientesList', {clientes, cant});
    } catch (error) {
      
    }
  };

  const  noteClient =async(req,res)=>{
    try {
      const {id} = req.params;
      const cliente = await client.findById({_id:id});
      res.render('notaClient', {cliente});
    } catch (error) {
      
    }
  };

  const saveNoteClient = async(req, res)=>{
    try {
      const {id} = req.params;
      const {nota} = req.body;
      const fecha = new Date().toLocaleDateString();
    const not = `${fecha} - ${nota}`;
    const newNota = await client.findOneAndUpdate({_id: id}, {nota: not});
    res.redirect('/client/listClient');
    } catch (error) {
      
    }
  }


module.exports = {
  crearCliente,
  cargarClientes,
  editClientGet,
  editClientPost,
  deleteClient,
  buscarCliente,
  listClient,
  noteClient,
  saveNoteClient
};

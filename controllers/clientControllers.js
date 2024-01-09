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
    email,
  } = req.body;
  try {
    let clienteNuevo = await client.findOne({dni});
    if (clienteNuevo) {
      return res.send("<h1>El cliente  ya existe</h1>");
    }
    clienteNuevo = new client(req.body);
    await clienteNuevo.save();
    res.send('<h1>cliente Guardado con exito</h1>');
  } catch (error) {
    return res.send("<h1>Error en la Data Base</h1>");
  }
};

const cargarClientes = async(req, res) =>{
  try {
    const token =  req.cookies.token;
    const verifyToken = await verifyJWT(token);
    const role = verifyToken.role;
    const clientes = await client.find();
     return res.render('clientes', {clientes, role});
  } catch (error) {
    console.log(error);
  }};

  const editClientGet = async(req, res) =>{
    try {
      const {id} = req.params;
      console.log(id);
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
  deleteClient
};

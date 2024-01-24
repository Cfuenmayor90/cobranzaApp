const users = require("../models/userModels");
const setPrest = require('../models/settingsModels');
const ventas = require('../models/ventasModels');
const { generarJWT, verifyJWT} = require('../middleware/jwt');


const cargarCobranza = async(req, res) =>{
    const token =  req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
      const verifyToken = await verifyJWT(token); 
      const prestamos = await ventas.find({cobRuta: verifyToken.numRuta});
      console.log(prestamos);
      res.render('cobranza', {prestamos});
}

module.exports = {cargarCobranza};
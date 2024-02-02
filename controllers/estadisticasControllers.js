const users = require("../models/userModels");
const ventas = require("../models/ventasModels");
const pagoN = require("../models/pagosModels");
const { generarJWT, verifyJWT } = require("../middleware/jwt");
const balances = require('../models/balanceModels');


const cargarEstadisticas = async (req, res) => {
    const token = req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    const verifyToken = await verifyJWT(token);
    const balance = await balances.find({ cobRuta: verifyToken.numRuta });

    res.render('estadisticas', {balance});
  
  };

  module.exports = {cargarEstadisticas};
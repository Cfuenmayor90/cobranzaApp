const users = require("../models/userModels");
const client = require("../models/clientModels");
const setPrest = require('../models/settingsModels');
const ventas = require('../models/ventasModels');
const pagoN = require('../models/pagosModels');
const { generarJWT, verifyJWT} = require('../middleware/jwt');


const cargarCobranza = async(req, res) =>{
    const token =  req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
      const verifyToken = await verifyJWT(token); 
      const prestamos = await ventas.find({cobRuta: verifyToken.numRuta});
      console.log(prestamos);
      res.render('cobranza', {prestamos});
}
const pagoSave = async(req, res) => {
    const {codPres, pago} = req.body;
    try {
        const prestamo = await ventas.findById({_id:codPres});
        console.log(prestamo);
        if (prestamo.mTotal > pago) {
            const pagoVa = new pagoN(req.body);
            await pagoVa.save();
            res.send('todo ok');
        } else {
            const mensajeError = '¡El monto del pago debe ser menor al SALDO!';
            res.render('error', {mensajeError});
        }
    } catch (error) {
        
    }
}

module.exports = {cargarCobranza, pagoSave};
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
};
const pagoSave = async(req, res) => {
    const {codPres, pago} = req.body;
    try {
        const prestamo = await ventas.findById({_id:codPres});
        console.log(prestamo);
        if (prestamo.mTotal > pago) {
            const pagoVa = new pagoN(req.body);
            await pagoVa.save();
            prestamo.mTotal = (prestamo.mTotal - pago);
            await ventas.findByIdAndUpdate({_id: codPres}, prestamo);
            res.send('todo ok');
        } else {
            const mensajeError = '¡El monto del pago debe ser menor al SALDO!';
            res.render('error', {mensajeError});
        }
    } catch (error) {
        res.render('error', {mensajeError});
    }
};
const listaPagos = async(req, res)=>{
    try {
        const {id} = req.params;
        console.log('id pago: '+id);
        const listPa = await pagoN.find({codPres: id});
       console.log(listPa);
       return res.render('pagosList', {listPa});
    } catch (error) {
        
    }
}

module.exports = {cargarCobranza, pagoSave, listaPagos};
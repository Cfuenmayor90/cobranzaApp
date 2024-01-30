const users = require("../models/userModels");
const client = require("../models/clientModels");
const setPrest = require("../models/settingsModels");
const ventas = require("../models/ventasModels");
const pagoN = require("../models/pagosModels");
const { generarJWT, verifyJWT } = require("../middleware/jwt");

const cargarCobranza = async (req, res) => {
  const token = req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
  const verifyToken = await verifyJWT(token);
  const prestamos = await ventas.find({ cobRuta: verifyToken.numRuta });
  var dia = "dia";
  switch (new Date().getDay()) {
    case 1 :
       dia = "lunes";
      break;
    case 2 :
         dia = "martes";
      break;
    case 3 :
     dia = "miercoles";
      break;
    case 4 :
     dia = "jueves";
      break;
    case 5 :
      dia = "viernes" ;
      break;
    case 6 :
      dia = "sabado";
      break;
    default:
        dia = "domingo";
      break;
  }
  const diaD = [dia, 'todos'];
  const coRu = verifyToken.numRuta;
  const esperado = await ventas.find({ cobRuta: coRu, diaDeCobro: diaD});
  const diaInici = new Date().toLocaleDateString();
  const pagosActuales = await pagoN.where("fecha").gte(diaInici).where("cobRuta").equals(coRu);
  console.log(pagosActuales);
  var monCobrado = 0;
  var espeValor = 0;
  pagosActuales.forEach(element => {
      monCobrado = element.pago + monCobrado;
  });
  esperado.forEach(element => {
      espeValor = element.cuota +espeValor;
  });
   console.log("Esperado: "+ espeValor);
  res.render("cobranza", { prestamos, espeValor,monCobrado, dia });
};
const pagoSave = async (req, res) => {
  const { codPres, pago } = req.body;
  try {
    const prestamo = await ventas.findById({ _id: codPres });
    console.log(prestamo);
    if (prestamo.mTotal > pago) {
      const pagoVa = new pagoN(req.body);
      const fechaActual = new Date().toLocaleDateString("es-AR");
      pagoVa.fecha = fechaActual;
      pagoVa.cobRuta = prestamo.cobRuta;
      await pagoVa.save();
      prestamo.mTotal = prestamo.mTotal - pago;
      await ventas.findByIdAndUpdate({ _id: codPres }, prestamo);
      res.send("todo ok");
    } else {
      const mensajeError = "¡El monto del pago debe ser menor al SALDO!";
      res.render("error", { mensajeError });
    }
  } catch (error) {
    res.render("error");
  }
};
const listaPagos = async (req, res) => {
  try {
    const { id } = req.params;
    const listPa = await pagoN.find({ codPres: id });
    const prestamo = await ventas.findOne({ _id: id });
    console.log(prestamo);
    const array = [];
    listPa.forEach((element) => {
      const fechaString = element.fecha;
      const id = element._id;
      const pagO = element.pago;
      array.push({ fechaString, id, pagO });
    });

    return res.render("pagosList", { array, prestamo });
  } catch (error) {}
};

module.exports = { cargarCobranza, pagoSave, listaPagos };

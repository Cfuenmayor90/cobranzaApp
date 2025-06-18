const express = require("express");
const { checkRole } = require("../controllers/usersControllers");
const router = express.Router();
const {
  cargarCobranza,
  pagoSave,
  listaPagos,
  listaPagosDiarios,
  envioTicket,
  refinanciarPres,
  saveRefinanciarPres,
  esperadoDiario,
  filterSem,
  note,
  saveNote, 
  posicionNumber,
  savePosicion,
  filterPosicion
} = require("../controllers/cobranzaControllers");
const { timeOp } = require("../middleware/timeOpe");

router.get("/", checkRole(["cobrador", 'pisoDeVenta']), cargarCobranza);

router.post("/savePago", checkRole(["cobrador", "pisoDeVenta"]), pagoSave);

router.get("/pagosList/:id", checkRole(["cobrador", "admin", "pisoDeVenta"]), listaPagos);

router.get(
  "/pagoListDiario/:coRu",
  checkRole(["cobrador", "admin", 'pisoDeVenta']),
  listaPagosDiarios
);

router.get("/filterSem/:coRu", checkRole(["admin", "cobrador", 'pisoDeVenta']), filterSem);

router.get("/filterPosicion/:coRu", checkRole(["admin", "cobrador", 'pisoDeVenta']), filterPosicion)

router.get("/ticket/:id", envioTicket);

router.get("/refinanciar/:id", checkRole(["admin", "pisoDeVenta"]), refinanciarPres);

router.post("/saveRefinanciar", checkRole(["admin"]), saveRefinanciarPres);

router.get("/generarBalance", checkRole(["admin"]), esperadoDiario);

router.get("/note/:id", checkRole(["admin", "cobrador", "pisoDeVenta"]), note);

router.post("/saveNote/:id", checkRole(["admin", "cobrador", "pisoDeVenta"]), saveNote);

router.get("/posicionNumber/:id", checkRole(["admin", "cobrador", "pisoDeVenta"]), posicionNumber);

router.post("/savePosicion", checkRole(["admin", "cobrador", "pisoDeVenta"]), savePosicion);
module.exports = router;

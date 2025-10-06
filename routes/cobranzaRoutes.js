const express = require("express");
const { checkRole } = require("../controllers/usersControllers");
const router = express.Router();
const {
  cargarCobranza,
  pagoSave,
  cargarTransf,
  cargarTranfCob,
  guardarTransfCob,
  confirmarTransf,
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

router.get("/transf", checkRole(["admin"]), cargarTransf);

router.get("/transfCob", checkRole(["cobrador", 'pisoDeVenta']), cargarTranfCob);

router.post("/saveTransfCob", checkRole(["cobrador", 'pisoDeVenta']), guardarTransfCob);

router.get("/confirmarTransf/:id", checkRole(["admin"]), confirmarTransf);

router.get("/pagosList/:id", checkRole(["cobrador", "admin", "pisoDeVenta", "supervisor"]), listaPagos);

router.get(
  "/pagoListDiario/:coRu",
  checkRole(["cobrador", "admin", 'pisoDeVenta', 'supervisor']),
  listaPagosDiarios
);

router.get("/filterSem/:coRu", checkRole(["admin", "cobrador", 'pisoDeVenta', 'supervisor']), filterSem);

router.get("/filterPosicion/:coRu", checkRole(["admin", "cobrador", 'pisoDeVenta', 'supervisor']), filterPosicion)

router.get("/ticket/:id", envioTicket);

router.get("/refinanciar/:id", checkRole(["admin", "pisoDeVenta", 'supervisor']), refinanciarPres);

router.post("/saveRefinanciar", checkRole(["admin"]), saveRefinanciarPres);

router.get("/generarBalance", checkRole(["admin"]), esperadoDiario);

router.get("/note/:id", checkRole(["admin", "cobrador", "pisoDeVenta", "supervisor"]), note);

router.post("/saveNote/:id", checkRole(["admin", "cobrador", "pisoDeVenta", "supervisor"]), saveNote);

router.get("/posicionNumber/:id", checkRole(["admin", "cobrador", "pisoDeVenta"]), posicionNumber);

router.post("/savePosicion", checkRole(["admin", "cobrador", "pisoDeVenta"]), savePosicion);
module.exports = router;

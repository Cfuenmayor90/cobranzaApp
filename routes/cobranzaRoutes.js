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
  saveNote
} = require("../controllers/cobranzaControllers");
const { timeOp } = require("../middleware/timeOpe");

router.get("/", checkRole(["cobrador"]), cargarCobranza);

router.post("/savePago", checkRole(["cobrador"]), pagoSave);

router.get("/pagosList/:id", checkRole(["cobrador", "admin"]), listaPagos);

router.get(
  "/pagoListDiario/:coRu",
  checkRole(["cobrador", "admin"]),
  listaPagosDiarios
);

router.get("/filterSem/:coRu", checkRole(["admin", "cobrador"]), filterSem);

router.get("/ticket/:id", envioTicket);

router.get("/refinanciar/:id", checkRole(["admin"]), refinanciarPres);

router.post("/saveRefinanciar", checkRole(["admin"]), saveRefinanciarPres);

router.get("/generarBalance", checkRole(["admin"]), esperadoDiario);

router.get("/note/:id", checkRole(["admin", "cobrador", "supervisor"]), note);

router.post("/saveNote/:id", checkRole(["admin", "cobrador", "supervisor"]), saveNote);

module.exports = router;

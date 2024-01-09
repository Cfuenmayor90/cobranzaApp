const express = require('express');
const router = express.Router();
const cotizarPlan = require('../controllers/ventasControllers');


router.post('/cotizar', cotizarPlan);
router.post('/guardar', (req, res) =>{

})

module.exports = router;
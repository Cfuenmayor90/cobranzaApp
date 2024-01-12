const setPrest = require('../models/settingsModels');

const guardarPlan = async(req, res) => {
    try {
        const {plan, cuotas, porcentaje, categoria} = req.body;
        console.log(req.body);
       const planNuevo = new setPrest(req.body);
       console.log('plan nuevo'+ planNuevo);
       await planNuevo.save();
       res.redirect('/vistas/settings');

    } catch (error) {
        
    }
};

module.exports = {guardarPlan};
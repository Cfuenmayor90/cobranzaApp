const setPrest = require('../models/settingsModels');

const cargarSettins = async(req,res) =>{
    try {
        const planActualPres = await setPrest.find({categoria: 'prestamo'});
        res.render('configuracion', {planActualPres});
    } catch (error) {
        
    }
}

const guardarPlan = async(req, res) => {
    try {
       const planNuevo = new setPrest(req.body);
       await planNuevo.save();
       res.redirect('/settings');
    } catch (error) {
        
    }
};
const deletePlan = async(req,res)=>{
    try {
        const {id} = req.params;
        await setPrest.findByIdAndDelete(id);
        res.redirect('/settings');
        
    } catch (error) {
        
    }
}

module.exports = {guardarPlan, cargarSettins, deletePlan};
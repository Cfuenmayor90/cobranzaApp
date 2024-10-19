const timeOp = (req,res,next) => {
    const hrFinal = new Date();
    hrFinal.setHours(20);
    hrFinal.setMinutes(30);
    hrFinal.setSeconds(0);
    const hrActual = new Date();
    const diaOp = new Date().getDay(); //obtenemos el numero de dia actual, si es domingo sera 0
    console.log("hora actual" + hrActual);
    console.log("hora final" + hrFinal);
    if ( hrActual <= hrFinal && diaOp !== 0) {
        console.log("fecha timeOp");
        next();
    } else {
        const mensajeError = "¡No Puedes Registrar Pagos En Este Horario! Intentalo antes de 20:30:00";
        res.render('error', {mensajeError});
    }
};

module.exports = {timeOp};
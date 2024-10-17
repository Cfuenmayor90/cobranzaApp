const timeOp = (req,res,next) => {
    const hrFinal = "20:30:00";
    const hrActual = new Date().toLocaleTimeString();
    const diaOp = new Date().getDay(); //obtenemos el numero de dia actual, si es domingo sera 0
    console.log(hrActual);
    console.log(hrFinal);
    if ( hrActual <= hrFinal && diaOp !== 0) {
        console.log("fecha timeOp");
        next();
    } else {
        const mensajeError = "¡No Puedes Registrar Pagos En Este Horario! Intentalo antes de 20:30:00";
        res.render('error', {mensajeError});
    }
};

module.exports = {timeOp};
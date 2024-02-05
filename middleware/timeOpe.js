const timeOp = (req,res,next) => {
    const hrFinal = "21:00:00";
    const hrActual = new Date().toTimeString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const diaOp = new Date().getDay("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'}); //obtenemos el numero de dia actual, si es domingo sera 0
    const hrInicial = "08:00:00";
    console.log(hrActual);
    if (hrInicial <= hrActual && hrActual <= hrFinal && diaOp !== 0) {
        console.log("fecha timeOp");
        next();
    } else {
        const mensajeError = "¡No Puedes Registrar Pagos En Este Horario! Intentalo de: 08:00:00 a 20:00:00";
        res.render('error', {mensajeError});
    }
}

module.exports = {timeOp};
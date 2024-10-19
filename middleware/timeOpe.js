const timeOp = (req,res,next) => {
    const h = new Date().toLocaleTimeString("es-AR", {timeZone: 'America/Argentina/Buenos_Aires'});
    const hrFinal = new Date();
    hrFinal.setTime(h);
   // hrFinal.setHours(20);
   // hrFinal.setMinutes(30);
   // hrFinal.setSeconds(0);
    const hrActual = new Date();
    const diaOp = new Date().getDay(); //obtenemos el numero de dia actual, si es domingo sera 0
    console.log("hora actual" + h);
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
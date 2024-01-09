function cotizarPlan(req, res) {
  const { dni, monto, cantCuotas, interes, plan, diasDeCobro } = req.body;
  /*if (window.confirm("Do you really want to leave?")) {
    window.open("exit.html", "Thanks for Visiting!");
  }*/
  res.send('carlos');
}

module.exports = cotizarPlan;
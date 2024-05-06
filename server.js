const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();
require('./dataBase/conexion');

const usersRoutes = require('./routes/usersRoutes');
const cobranzaRoutes = require('./routes/cobranzaRoutes');
const productsRoutes = require('./routes/productsRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const vistasRoutes = require('./routes/vistasRoutes');
const clientRoutes = require('./routes/clientRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const calculadoraRoutes = require('./routes/calculadoraRoutes');
const generalRoutes = require('./routes/generalRoutes');
const alertasRoutes = require('./routes/alertasRoutes');
const { log } = require('console');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
 app.use(express.static(path.join(__dirname, 'public')));
 app.set('view engine', 'hbs');
 app.set('views', path.join(__dirname, '/views'));
 app.use(cookieParser());
 hbs.registerPartials(path.join(__dirname, '/views/partials'));

 app.use('/users', usersRoutes);
 app.use('/cobranza', cobranzaRoutes);
 app.use('/products', productsRoutes);
 app.use('/ventas', ventasRoutes);
 app.use('/vistas', vistasRoutes);
 app.use('/client', clientRoutes);
 app.use('/settings', settingsRoutes);
 app.use('/calculadora', calculadoraRoutes);
 app.use('/general', generalRoutes);
 app.use('/alertas', alertasRoutes);

 app.get('/', (req, res) => {
   res.render('index');
 });


app.listen(PORT, (req, res) => {
    console.log("servidor corriendo en el puerto" + PORT);
});
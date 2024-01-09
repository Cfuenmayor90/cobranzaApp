const mongoose = require('mongoose');
require('dotenv').config();

const URL_ATLAS = process.env.MONGO_URL_ATLAS;

const conexion = mongoose.connect(URL_ATLAS).then(()=>{
    console.log('Conexion a la Data Base exitosa');
}).catch(err=> console.log(err));


module.exports = conexion;
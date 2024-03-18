const mongoose = require('mongoose');
const  {Schema} = require('mongoose');

const historyVentaSchema = new Schema({
    nombre: {
        type: String,
        require: true
    },
    dni: {
        type: Number,
        require: true
    },
    venRuta: {
        type: Number,
        require: true
    },
    cobRuta:{
        type: Number,
        require: true
    },
    codProd:{
        type: String
    },
    detalle:{
        type: String
    },
    mTotal:{
        type: Number,
        require: true
    },
    categoria:{
        type: String,
        require: true
    },
    plan:{
        type: String,
        require: true
    },
    direccion:{
        type: String,
        require: true
    },
    fechaInicio: {
        type: String,
        require: true
    },
    timeStamp:{
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('historyVentas', historyVentaSchema);
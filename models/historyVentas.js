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
    user:{
        type: Number
    },
    codProd:{
        type: Array
    },
    detalle:{
        type: String
    },
    mTotal:{
        type: Number,
        require: true
    },
    descuento: {
      type: Number
    },
    categoria:{
        type: String,
        require: true
    },
    plan:{
        type: String,
        require: true
    },
    fechaInicio: {
        type: String,
        require: true
    },
    timeStamp:{
        type: Date,
        require: true,
        default: () => new Date(Date.now() - 3 * 60 * 60 * 1000)
    }

});

module.exports = mongoose.model('historyVentas', historyVentaSchema);
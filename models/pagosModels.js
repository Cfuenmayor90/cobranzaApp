const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const pagoSchema = new Schema({
    codPres: {
        type: String,
        require: true
    },
    cobRuta:{
        type: Number,
        require: true
    },
    fecha: {
        type: String,
        require: true
    },
    pago: {
        type: Number,
        require: true
    },
    transfMonto: {
        type: Number,
        require: false
    },
    transfFecha: {
        type: String,
        require: false
    },
  timeStamp:{
        type: Date,
        require: true,
        default: Date.now() - 10800000
    }

});

module.exports = mongoose.model('pago', pagoSchema);
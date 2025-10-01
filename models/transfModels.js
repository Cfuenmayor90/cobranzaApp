const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const transfSchema = new Schema({
    codPres: {
        type: String,
        require: true
    },
    cobRuta:{
        type: Number,
        require: true
    },
    nombre:{
        type: String,
        require: true
    },
    dni:{
        type: Number,
        require: true
    },
    transfFecha: {
        type: String,
        require: true
    },
    fecha: {
        type: String,
        require: true
    },
    monto: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: 'PENDIENTE'
    },
    timeStamp:{
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('transferencia', transfSchema);
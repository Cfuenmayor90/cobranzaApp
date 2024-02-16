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
    timeStamp:{
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('pago', pagoSchema);
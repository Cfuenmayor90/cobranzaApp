const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const pagoSchema = new Schema({
    codPres: {
        type: String,
        require: true
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    pago: {
        type: Number,
        require: true
    }

});

module.exports = mongoose.model('pago', pagoSchema);
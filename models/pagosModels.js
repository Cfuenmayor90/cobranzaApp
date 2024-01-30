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
    timeStamp:{
       type: Date,
       default: new Date()
    },
    pago: {
        type: Number,
        require: true
    }

});

module.exports = mongoose.model('pago', pagoSchema);
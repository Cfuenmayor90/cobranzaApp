const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const balanceSchema = new Schema({
    cobRuta:{
        type: Number,
        require: true
    },
    nombre:{
        type: String,
        require: true
    },
    fecha: {
        type: String,
        require: true
    },
    timeStamp:{
        type: Date,
        default: Date.now
    },
    cobrado: {
        type: Number
    },
    esperado: {
        type: Number,
        require: true
    },
    ventas:{
        type: Number
    },
    ganancia:{
        type: Number
    },
    categoria: {
        type: String
    }
    
});

module.exports = mongoose.model('balances', balanceSchema);
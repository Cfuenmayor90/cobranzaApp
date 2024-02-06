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
    cobrado: {
        type: Number,
        require: true
    },
    esperado: {
        type: Number,
        require: true
    },
    categoria: {
        type: String
    }
    
});

module.exports = mongoose.model('balances', balanceSchema);
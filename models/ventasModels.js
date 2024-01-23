const mongoose = require('mongoose');
const  {Schema} = require('mongoose');

const ventaSchema = new Schema({
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
    monto:{
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
    cuotas:{
        type: Number,
        require: true
    },
    cuota:{
        type: Number,
        require: true
    },
    diaDeCobro:{
        type: String,
        require: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('ventas', ventaSchema);
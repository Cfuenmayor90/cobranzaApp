const mongoose = require('mongoose');
const {Schema}= require('mongoose');

const cajaSchema = new Schema({
    monto: {
        type: Number,
        require: true
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
     userCod:{
        type: Number,
        require: true
    },
    tipo:{
        type: String,
        require: true
    },
    detalle:{
        type: String
    }
})

module.exports = mongoose.model('caja', cajaSchema);
const mongoose = require('mongoose');
const  {Schema} = require('mongoose');


const cxpSchema = new Schema({
    descripcion: {
        type: String,
        require: true   
    },
    montoInicial: {
        type: Number,
        require: true   
    },
    interes: {
        type: Number,
        require: false   
    },
    saldo: {
        type: Number,
        require: true   
    },
    tipo: {
        type: String,
        require: true   
    },
    fechaInicio: {
        type: String
    },
    fechaVencimiento: {
        type: String
    },
    timeStamp: {
        type: Date,
        require: true,
        default: () => new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
});

module.exports = mongoose.model('Cxp', cxpSchema);
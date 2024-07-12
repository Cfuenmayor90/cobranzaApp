const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const clientSchema = new Schema({
   nombre: {
    type: String,
    require: true
   },
    dni:{
        type: Number,
        require: true,
        unique: true
    },
    rubro:{
        type: String,
        require: true
    },
    localidadComercial:{
        type: String,
        require: true
    },
    dirComercial:{
        type: String,
        require: true
    },
    localidadParticular:{
        type: String,
        require: true
    },
    dirParticular:{
        type: String,
        require: true
    },
    celular:{
        type: Number,
        require: true
    },
    telefono:{
        type: Number,
        require: true
    },
    email:{
        type: String,
    },
    timeStamp:{
        type: Date,
        default: Date.now
    },
    nota:{
        type: String
    }
});

module.exports = mongoose.model('clients', clientSchema);
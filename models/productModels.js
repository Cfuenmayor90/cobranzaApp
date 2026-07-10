const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const productSchema = new Schema({
    
    cod:{
        type: String,
        require: true
    },
    nombre:{
        type: String,
        require: true
    },
    descripcion:{
        type: String
    },
    precio:{
        type: Number,
        require: true
    },
    categoria:{
        type: String,
        require: true
    },
 
    imagen:{
        type: String,
        require: true
    },
    stock:{
        type: Number
    },
    garantia:{
        type: String
    },
    timeStamp:{
        type: Date,
        require: true,
        default: () => new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
});

module.exports = mongoose.model('product', productSchema);
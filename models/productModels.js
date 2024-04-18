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
    }
},
{timestamps: true}
)

module.exports = mongoose.model('product', productSchema);
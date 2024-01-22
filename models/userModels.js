const mongoose = require('mongoose');
const {Schema} = require('mongoose');




const userSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    dni:{
        type: Number,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type: String,
        require: true
    },
    direccion:{
        type: String,
        require: true
    },
    telefono:{
        type: Number,
        require: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    numRuta: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('users', userSchema);
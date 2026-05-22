const { configDotenv } = require('dotenv');
const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const creditCardSchema = new Schema({
    tarjeta:{
        type: String,
        require: true
    },
    nombre: {
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
    cuotas: {
        type: Number,
        require: true   
    },
    tasa: {
        type: Number,
        require: true
    },
    num: {

        type: Number,
        require: false
    }
});

module.exports = mongoose.model('creditCards', creditCardSchema);


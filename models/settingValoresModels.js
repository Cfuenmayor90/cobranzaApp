const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const setValores = new Schema({
    dolar:{
        type: Number,
        require: true
    },
    porcentaje:{
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('setValores', setValores);



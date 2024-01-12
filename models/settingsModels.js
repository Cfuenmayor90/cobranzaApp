const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const settingsPrestSchema = new Schema({
    plan: {
        type: String,
        require: true
    },
    cuotas:{
        type: Number,
        require: true
    },
    porcentaje:{
        type: Number,
        require: true
    },
    categoria:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('setPrest', settingsPrestSchema);
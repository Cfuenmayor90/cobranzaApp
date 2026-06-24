const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  dni: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  telefono: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  numRuta: {
    type: Number,
    require: true
  },
  ingreso: {
    type: Date
  },
  nota: {
    type: String
  },
  sueldo: {
    type: Number
  },
  actSueldoDate: {
    type: Date
  }
});

module.exports = mongoose.model("users", userSchema);

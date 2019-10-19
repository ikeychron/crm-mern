const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "Agrega un email"
  },
  nombre: {
    type: String,
    required: "Agrega tu nombre"
  },
  password: {
    type: String,
    required: "Agrega una contraseña"
  }
});

module.exports = mongoose.model("Usuarios", usuariosSchema);

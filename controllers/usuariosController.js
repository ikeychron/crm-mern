const Usuarios = require("../models/Usuarios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Registrar Usuario
exports.registrarUsuario = async (req, res) => {
  // Leer datos del usuario y guardarlos en la DB
  const usuario = new Usuarios(req.body);

  // Hashear password
  if (usuario.password) {
    usuario.password = await bcrypt.hash(req.body.password, 12);
  }

  try {
    await usuario.save();
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.log(error.errors);
    res.json({ error: error.errors });
  }
};

// Autenticar Usuario
exports.autenticarUsuario = async (req, res, next) => {
  // Buscar usuario
  const {email, password} = req.body;

  const usuario = await Usuarios.findOne({email});

  // Si el usuario no existe
  if(!usuario) {
    await res.status(401).json({mensaje: 'Ese usuario no existe'});
    next();
  } 

  // Sí existe el usuario, validar password
  if(!bcrypt.compareSync(password, usuario.password)) {
    await res.status(401).json({mensaje: 'Password Incorrecto'});
    next();
  } 

  // Usuario autenticado - firmar token
  const token = jwt.sign({
    email: usuario.email,
    nombre: usuario.nombre,
    _id: usuario.id
  }, 'AVENGERS', {
    expiresIn: '1h'
  });

  // Retornar token
  res.json({token});

};

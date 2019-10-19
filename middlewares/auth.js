const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  // Autorización por el header
  const authHeader = req.get('Authorization');

  if(!authHeader) {
    const error = new Error('No estás autenticado, no hay JWT');
    error.statusCode = 401;
    throw error;
  }

  // Obtener token
  const token = authHeader.split(' ')[1];

  // Verificar token
  let revisarToken;

  try {
    revisarToken = jwt.verify(token, 'AVENGERS');
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  // Sí es un token válido, pero hay algún error (Expiración)
  if(!revisarToken) {
    const error = new Error('No estás autenticado');
    error.statusCode = 500;
    throw error;
  }

  next();
}
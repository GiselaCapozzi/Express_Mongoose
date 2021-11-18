const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const jwtToken = req.header('Authorization')
  if(!jwtToken) return res.status(401).send('Acceso denegado. Necesitamos un token válido')

  try {
    const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_CAR_API)
    req.user = payload
    next();
  } catch (err) {
    res.status(400).send('Acceso denegado. Token no válido')
  }
}

module.exports = auth;
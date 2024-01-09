const jwt = require('jsonwebtoken');
//const users = require('../models/userModels');
require('dotenv').config();

const secretKey = process.env.CLAVE_JWT;

// Generar un token JWT basado en el detalle del cliente
const generarJWT = async (users) => {

    
    return jwt.sign(
        {
            dni: users.dni,
            role: users.role,
            nombre: users.nombre
        },
        secretKey,
        {
            expiresIn: '30m' // Expiración del token en 30 minutos
        }
        );
        
    }
    
    
    //const token = req.cookies.token; // Obtener el token JWT de las cookies de la solicitud
    // Verificar un token JWT y devolver su contenido si es válido
    const verifyJWT = async (token) => {
        console.log('verifyJWT');
        try {
            console.log('verifyJWT  try');
            return jwt.verify(token, secretKey);
      
    } catch (e) {
        // 
        console.log('__Algo fallo___', e)
        return null
    }
} 
//const verifyToken = await verifyJWT(token); // Verificar el token JWT

module.exports = {
    generarJWT,
    verifyJWT
}

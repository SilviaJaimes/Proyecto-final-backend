import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No autorizado - Token inválido' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no existe' });
    }

    req.user = { 
      id: user.id, 
      correo: user.correo, 
      rol: user.rol, 
      nombre: user.nombre 
    };
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({ 
      message: 'Token inválido o expirado',
      error: error.message 
    });
  }
};

export default authMiddleware;
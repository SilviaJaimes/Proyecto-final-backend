import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Estudiante from '../models/Estudiante.js';
import Tutor from '../models/Tutor.js';

export const register = async (req, res) => {
  try {
    const { nombre, correo, password, rol, programa, especialidad, descripcion } = req.body;
    
    const existing = await User.findByEmail(correo);
    if (existing) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, correo, password: hashed, rol });

    if (rol === 'estudiante') {
      await Estudiante.create({ usuario_id: user.id, nivel_academico: programa });
    } else if (rol === 'tutor') {
      await Tutor.create({ usuario_id: user.id, especialidad, descripcion });
    }

    return res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ 
      message: 'Error en registro',
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    
    const user = await User.findByEmail(correo);
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.json({ 
      message: 'Login correcto',
      token, 
      usuario: { 
        id: user.id, 
        nombre: user.nombre, 
        correo: user.correo, 
        rol: user.rol 
      } 
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      message: 'Error en login',
      error: error.message 
    });
  }
};
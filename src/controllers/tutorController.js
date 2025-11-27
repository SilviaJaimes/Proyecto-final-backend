import Tutor from '../models/Tutor.js';
import Horario from '../models/Horario.js';
import User from '../models/User.js';

export const crearHorario = async (req, res) => {
  try {
    if (req.user.rol !== 'tutor') {
      return res.status(403).json({ message: 'Solo tutores pueden crear horarios' });
    }

    const tutor = await Tutor.findOne({ where: { usuario_id: req.user.id } });
    if (!tutor) {
      return res.status(404).json({ message: 'Perfil de tutor no encontrado' });
    }

    const { fecha, hora } = req.body;
    
    if (!fecha || !hora) {
      return res.status(400).json({ message: 'Fecha y hora son obligatorios' });
    }

    const horario = await Horario.create({ 
      tutor_id: tutor.id, 
      fecha, 
      hora,
      estado: 'disponible'
    });

    return res.status(201).json({
      message: 'Horario creado exitosamente',
      horario
    });
  } catch (error) {
    console.error('Error creando horario:', error);
    return res.status(500).json({ 
      message: 'Error creando horario',
      error: error.message 
    });
  }
};

export const listarTutores = async (req, res) => {
  try {
    const tutores = await Tutor.findAll({
      include: [{ 
        model: User, 
        as: 'usuario', 
        attributes: ['id', 'nombre', 'correo'] 
      }]
    });

    return res.json({
      message: 'Tutores obtenidos exitosamente',
      tutores
    });
  } catch (error) {
    console.error('Error listando tutores:', error);
    return res.status(500).json({ 
      message: 'Error listando tutores',
      error: error.message 
    });
  }
};

export const listarHorariosTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor no encontrado' });
    }

    const horarios = await Horario.findAll({ 
      where: { 
        tutor_id: tutorId, 
        estado: 'disponible' 
      },
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    return res.json({
      message: 'Horarios obtenidos exitosamente',
      horarios
    });
  } catch (error) {
    console.error('Error listando horarios:', error);
    return res.status(500).json({ 
      message: 'Error listando horarios',
      error: error.message 
    });
  }
};

export const obtenerPerfilTutor = async (req, res) => {
  try {
    if (req.user.rol !== 'tutor') {
      return res.status(403).json({ message: 'Solo tutores pueden acceder a este recurso' });
    }

    const tutor = await Tutor.findOne({
      where: { usuario_id: req.user.id },
      include: [{ 
        model: User, 
        as: 'usuario', 
        attributes: ['id', 'nombre', 'correo'] 
      }]
    });

    if (!tutor) {
      return res.status(404).json({ message: 'Perfil de tutor no encontrado' });
    }

    return res.json({
      message: 'Perfil obtenido exitosamente',
      tutor
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return res.status(500).json({ 
      message: 'Error obteniendo perfil',
      error: error.message 
    });
  }
};

export const actualizarPerfilTutor = async (req, res) => {
  try {
    if (req.user.rol !== 'tutor') {
      return res.status(403).json({ message: 'Solo tutores pueden actualizar su perfil' });
    }

    const tutor = await Tutor.findOne({ where: { usuario_id: req.user.id } });
    if (!tutor) {
      return res.status(404).json({ message: 'Perfil de tutor no encontrado' });
    }

    const { especialidad, descripcion } = req.body;

    await tutor.update({
      ...(especialidad && { especialidad }),
      ...(descripcion && { descripcion })
    });

    return res.json({
      message: 'Perfil actualizado exitosamente',
      tutor
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return res.status(500).json({ 
      message: 'Error actualizando perfil',
      error: error.message 
    });
  }
};

export const obtenerPerfilTutorPublico = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const tutor = await Tutor.findByPk(tutorId, {
      include: [{ 
        model: User, 
        as: 'usuario', 
        attributes: ['id', 'nombre', 'correo'] 
      }]
    });

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor no encontrado' });
    }

    return res.json({
      message: 'Perfil del tutor obtenido exitosamente',
      tutor
    });
  } catch (error) {
    console.error('Error obteniendo perfil del tutor:', error);
    return res.status(500).json({ 
      message: 'Error obteniendo perfil del tutor',
      error: error.message 
    });
  }
};
import Tutoria from '../models/Tutoria.js';
import Tutor from '../models/Tutor.js';
import Estudiante from '../models/Estudiante.js';
import Horario from '../models/Horario.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const solicitarTutoria = async (req, res) => {
  try {
    if (req.user.rol !== 'estudiante') {
      return res.status(403).json({ message: 'Solo estudiantes pueden solicitar tutorías' });
    }

    const estudiante = await Estudiante.findOne({ where: { usuario_id: req.user.id }});
    if (!estudiante) {
      return res.status(404).json({ message: 'Perfil de estudiante no encontrado' });
    }

    const { tutorId, fecha, hora, horarioId } = req.body;

    if (!tutorId || !fecha || !hora) {
      return res.status(400).json({ message: 'Tutor, fecha y hora son obligatorios' });
    }

    // Verificar que el tutor existe
    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor no encontrado' });
    }

    // Si se usa horarioId, marcar como ocupado
    if (horarioId) {
      const horario = await Horario.findByPk(horarioId);
      if (!horario || horario.estado !== 'disponible') {
        return res.status(400).json({ message: 'Horario no disponible' });
      }
      horario.estado = 'ocupado';
      await horario.save();
    }

    const tutoria = await Tutoria.create({
      estudiante_id: estudiante.id,
      tutor_id: tutorId,
      horario_id: horarioId || null,
      fecha,
      hora,
      estado: 'pendiente'
    });

    return res.status(201).json({
      message: 'Tutoría solicitada exitosamente',
      tutoria
    });
  } catch (error) {
    console.error('Error solicitando tutoría:', error);
    return res.status(500).json({ 
      message: 'Error solicitando tutoría',
      error: error.message 
    });
  }
};

export const verSolicitudesParaTutor = async (req, res) => {
  try {
    if (req.user.rol !== 'tutor') {
      return res.status(403).json({ message: 'Solo tutores pueden ver solicitudes' });
    }

    const tutor = await Tutor.findOne({ where: { usuario_id: req.user.id }});
    if (!tutor) {
      return res.status(404).json({ message: 'Perfil de tutor no encontrado' });
    }

    const solicitudes = await Tutoria.findAll({
      where: { 
        tutor_id: tutor.id, 
        estado: { [Op.in]: ['pendiente'] } 
      },
      include: [{ 
        model: Estudiante, 
        as: 'estudiante', 
        include: [{ 
          model: User, 
          as: 'usuario', 
          attributes: ['nombre', 'correo'] 
        }] 
      }],
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    return res.json({
      message: 'Solicitudes obtenidas exitosamente',
      solicitudes
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    return res.status(500).json({ 
      message: 'Error obteniendo solicitudes',
      error: error.message 
    });
  }
};

export const responderSolicitud = async (req, res) => {
  try {
    if (req.user.rol !== 'tutor') {
      return res.status(403).json({ message: 'Solo tutores pueden responder solicitudes' });
    }

    const { id } = req.params;
    const { accion } = req.body; // 'aceptar', 'rechazar', 'finalizar'

    if (!accion || !['aceptar', 'rechazar', 'finalizar'].includes(accion)) {
      return res.status(400).json({ message: 'Acción inválida. Use: aceptar, rechazar o finalizar' });
    }

    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) {
      return res.status(404).json({ message: 'Tutoría no encontrada' });
    }

    const tutor = await Tutor.findOne({ where: { usuario_id: req.user.id }});
    if (tutoria.tutor_id !== tutor.id) {
      return res.status(403).json({ message: 'No autorizado para modificar esta tutoría' });
    }

    if (accion === 'aceptar') {
      tutoria.estado = 'aceptada';
    } else if (accion === 'rechazar') {
      tutoria.estado = 'rechazada';
      // Liberar horario si existe
      if (tutoria.horario_id) {
        const horario = await Horario.findByPk(tutoria.horario_id);
        if (horario) { 
          horario.estado = 'disponible'; 
          await horario.save(); 
        }
      }
    } else if (accion === 'finalizar') {
      tutoria.estado = 'finalizada';
    }

    await tutoria.save();

    return res.json({
      message: `Tutoría ${accion === 'aceptar' ? 'aceptada' : accion === 'rechazar' ? 'rechazada' : 'finalizada'} exitosamente`,
      tutoria
    });
  } catch (error) {
    console.error('Error respondiendo solicitud:', error);
    return res.status(500).json({ 
      message: 'Error respondiendo solicitud',
      error: error.message 
    });
  }
};

export const registrarResumen = async (req, res) => {
  try {
    if (req.user.rol !== 'tutor') {
      return res.status(403).json({ message: 'Solo tutores pueden registrar resúmenes' });
    }

    const { id } = req.params;
    const { resumen } = req.body;

    if (!resumen) {
      return res.status(400).json({ message: 'El resumen es obligatorio' });
    }

    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) {
      return res.status(404).json({ message: 'Tutoría no encontrada' });
    }

    const tutor = await Tutor.findOne({ where: { usuario_id: req.user.id }});
    if (tutoria.tutor_id !== tutor.id) {
      return res.status(403).json({ message: 'No autorizado para modificar esta tutoría' });
    }

    tutoria.resumen = resumen;
    tutoria.estado = 'finalizada';
    await tutoria.save();

    return res.json({
      message: 'Resumen registrado exitosamente',
      tutoria
    });
  } catch (error) {
    console.error('Error registrando resumen:', error);
    return res.status(500).json({ 
      message: 'Error registrando resumen',
      error: error.message 
    });
  }
};

export const historialUsuario = async (req, res) => {
  try {
    const { rol } = req.user;

    if (rol === 'estudiante') {
      const estudiante = await Estudiante.findOne({ where: { usuario_id: req.user.id }});
      if (!estudiante) {
        return res.status(404).json({ message: 'Perfil de estudiante no encontrado' });
      }

      const historiales = await Tutoria.findAll({ 
        where: { estudiante_id: estudiante.id },
        include: [{ 
          model: Tutor, 
          as: 'tutor',
          include: [{ 
            model: User, 
            as: 'usuario', 
            attributes: ['nombre', 'correo'] 
          }]
        }],
        order: [['fecha', 'DESC'], ['hora', 'DESC']]
      });

      return res.json({
        message: 'Historial obtenido exitosamente',
        historiales
      });

    } else if (rol === 'tutor') {
      const tutor = await Tutor.findOne({ where: { usuario_id: req.user.id }});
      if (!tutor) {
        return res.status(404).json({ message: 'Perfil de tutor no encontrado' });
      }

      const historiales = await Tutoria.findAll({ 
        where: { tutor_id: tutor.id },
        include: [{ 
          model: Estudiante, 
          as: 'estudiante',
          include: [{ 
            model: User, 
            as: 'usuario', 
            attributes: ['nombre', 'correo'] 
          }]
        }],
        order: [['fecha', 'DESC'], ['hora', 'DESC']]
      });

      return res.json({
        message: 'Historial obtenido exitosamente',
        historiales
      });

    } else {
      return res.status(400).json({ message: 'Rol inválido' });
    }
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return res.status(500).json({ 
      message: 'Error obteniendo historial',
      error: error.message 
    });
  }
};

export const reporteTutor = async (req, res) => {
  try {
    if (req.user.rol !== 'tutor') {
      return res.status(403).json({ message: 'Solo tutores pueden generar reportes' });
    }

    const { desde, hasta } = req.query; // formato: yyyy-mm-dd
    
    const tutor = await Tutor.findOne({ where: { usuario_id: req.user.id }});
    if (!tutor) {
      return res.status(404).json({ message: 'Perfil de tutor no encontrado' });
    }

    const where = { tutor_id: tutor.id };
    
    if (desde && hasta) {
      where.fecha = { [Op.between]: [desde, hasta] };
    }

    const tutorias = await Tutoria.findAll({ 
      where,
      include: [{ 
        model: Estudiante, 
        as: 'estudiante',
        include: [{ 
          model: User, 
          as: 'usuario', 
          attributes: ['nombre', 'correo'] 
        }]
      }],
      order: [['fecha', 'DESC'], ['hora', 'DESC']]
    });

    // Estadísticas
    const estadisticas = {
      total: tutorias.length,
      pendientes: tutorias.filter(t => t.estado === 'pendiente').length,
      aceptadas: tutorias.filter(t => t.estado === 'aceptada').length,
      finalizadas: tutorias.filter(t => t.estado === 'finalizada').length,
      rechazadas: tutorias.filter(t => t.estado === 'rechazada').length,
      canceladas: tutorias.filter(t => t.estado === 'cancelada').length
    };

    return res.json({
      message: 'Reporte generado exitosamente',
      periodo: { desde, hasta },
      estadisticas,
      tutorias
    });
  } catch (error) {
    console.error('Error generando reporte:', error);
    return res.status(500).json({ 
      message: 'Error generando reporte',
      error: error.message 
    });
  }
};

export const cancelarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) {
      return res.status(404).json({ message: 'Tutoría no encontrada' });
    }

    // Verificar que el usuario sea el estudiante dueño de la tutoría
    if (req.user.rol === 'estudiante') {
      const estudiante = await Estudiante.findOne({ where: { usuario_id: req.user.id }});
      if (!estudiante || tutoria.estudiante_id !== estudiante.id) {
        return res.status(403).json({ message: 'No autorizado para cancelar esta tutoría' });
      }
    }

    // Solo se puede cancelar si está pendiente o aceptada
    if (!['pendiente', 'aceptada'].includes(tutoria.estado)) {
      return res.status(400).json({ 
        message: 'Solo se pueden cancelar tutorías pendientes o aceptadas' 
      });
    }

    tutoria.estado = 'cancelada';
    if (motivo) {
      tutoria.motivo_cancelacion = motivo;
    }
    await tutoria.save();

    // Liberar horario si existe
    if (tutoria.horario_id) {
      const horario = await Horario.findByPk(tutoria.horario_id);
      if (horario) { 
        horario.estado = 'disponible'; 
        await horario.save(); 
      }
    }

    return res.json({
      message: 'Tutoría cancelada exitosamente',
      tutoria
    });
  } catch (error) {
    console.error('Error cancelando tutoría:', error);
    return res.status(500).json({ 
      message: 'Error cancelando tutoría',
      error: error.message 
    });
  }
};
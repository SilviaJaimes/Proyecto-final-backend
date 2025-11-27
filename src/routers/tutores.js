import express from 'express';
import { 
  crearHorario, 
  listarTutores, 
  listarHorariosTutor,
  obtenerPerfilTutor,
  actualizarPerfilTutor,
  obtenerPerfilTutorPublico
} from '../controllers/tutorController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', listarTutores);
router.get('/:tutorId/horarios', listarHorariosTutor);
router.get('/:tutorId/perfil', obtenerPerfilTutorPublico);

// Rutas protegidas (requieren autenticación)
router.post('/horarios', auth, crearHorario);
router.get('/perfil', auth, obtenerPerfilTutor);
router.put('/perfil', auth, actualizarPerfilTutor);

export default router;
import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { 
  solicitarTutoria, 
  verSolicitudesParaTutor, 
  responderSolicitud, 
  registrarResumen, 
  historialUsuario, 
  reporteTutor,
  cancelarTutoria
} from '../controllers/tutoriaController.js';

const router = express.Router();

// Rutas protegidas (todas requieren autenticación)
router.post('/', auth, solicitarTutoria);
router.get('/solicitudes', auth, verSolicitudesParaTutor);
router.post('/:id/responder', auth, responderSolicitud);
router.post('/:id/resumen', auth, registrarResumen);
router.patch('/:id/cancelar', auth, cancelarTutoria);
router.get('/historial', auth, historialUsuario);
router.get('/reporte', auth, reporteTutor);

export default router;
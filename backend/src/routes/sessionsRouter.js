import express from 'express';
import { iniciarSesion, cerrarSesion, obtenerHistorialSesiones, obtenerResumenBienvenida} from "../controllers/sessionsController.js";
import { verificarToken } from "../utils/authMiddleware.js";

const router = express.Router();

// Rutas de autenticación
router.post('/login', iniciarSesion);
router.post('/logout', verificarToken, cerrarSesion); 
router.get('/sesiones/:usuarioId', verificarToken, obtenerHistorialSesiones); // Solo admins
router.get('/resumen', verificarToken, obtenerResumenBienvenida);


export default router;





import express from 'express';
import { iniciarSesion, cerrarSesion, obtenerResumenBienvenida, obtenerResumenDashboard} from "../controllers/sessionsController.js";
import { verificarToken } from "../utils/authMiddleware.js";

const router = express.Router();

// Rutas de autenticación
router.post('/login', iniciarSesion);
router.post('/logout', verificarToken, cerrarSesion); 
router.get('/resumen', verificarToken, obtenerResumenBienvenida);
router.get('/resumenDashboard', verificarToken, obtenerResumenDashboard); 

export default router;





import express from 'express';
import {
  crearPersona,
  obtenerPersonas,
  obtenerPersonaPorId,
  eliminarPersona,
  obtenerPersonasNoAdmin,
  actualizarPersona,
  obtenerPersonaPorUsuarioId,
  buscarPersonas
  
} from '../controllers/personaController.js';
import { verificarToken } from "../utils/authMiddleware.js";

const router = express.Router();



router.get('/buscar', buscarPersonas);

// Crear una persona
router.post('/crear', crearPersona);

// Obtener todas las personas
router.get('/', obtenerPersonas);

// Obtener personas que no son admin
router.get('/no-admin', obtenerPersonasNoAdmin);

// Obtener persona por ID de usuario (más específico)
router.get('/por-usuario/:idUsuario', obtenerPersonaPorUsuarioId);

// Obtener una persona por ID de persona
router.get('/:id', obtenerPersonaPorId);

// Actualizar persona
router.put('/:id', actualizarPersona);

// Eliminar persona lógicamente
router.delete('/:id', eliminarPersona);

export default router;

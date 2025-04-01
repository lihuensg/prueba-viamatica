import express from 'express';
import { crearPersona, obtenerPersonas, obtenerPersonaPorId, actualizarPersona, eliminarPersona } from '../controllers/personaController.js';

const router = express.Router();

// Ruta para crear una persona
router.post('/crear', crearPersona);

// Ruta para obtener todas las personas
router.get('/', obtenerPersonas);

// Ruta para obtener una persona por ID
router.get('/:id', obtenerPersonaPorId);

// Ruta para actualizar una persona
router.put('/:id', actualizarPersona);

// Ruta para eliminar una persona lógicamente
router.delete('/:id', eliminarPersona);

export default router;

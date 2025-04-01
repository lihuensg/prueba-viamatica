import express from 'express';
import { crearRolOpcion, obtenerRolOpciones, obtenerRolOpcionPorId, actualizarRolOpcion, eliminarRolOpcion } from '../controllers/rolOpcionesController.js';

const router = express.Router();

// Ruta para crear una opción de rol
router.post('/crear', crearRolOpcion);

// Ruta para obtener todas las opciones de rol
router.get('/', obtenerRolOpciones);

// Ruta para obtener una opción de rol por ID
router.get('/:id', obtenerRolOpcionPorId);

// Ruta para actualizar una opción de rol
router.put('/:id', actualizarRolOpcion);

// Ruta para eliminar una opción de rol lógicamente
router.delete('/:id', eliminarRolOpcion);

export default router;

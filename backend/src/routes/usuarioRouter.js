import express from 'express';
import { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

// Ruta para crear un usuario
router.post('/crear', crearUsuario);

// Ruta para obtener todos los usuarios
router.get('/', obtenerUsuarios);

// Ruta para obtener un usuario por ID
router.get('/:id', obtenerUsuarioPorId);

// Ruta para actualizar un usuario
router.put('/:id', actualizarUsuario);

// Ruta para eliminar un usuario lógicamente
router.delete('/:id', eliminarUsuario);

export default router;

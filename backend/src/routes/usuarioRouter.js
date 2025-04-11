import express from 'express';
import {
    
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  cargaMasivaUsuarios,
  obtenerUsuariosEstado, 
  actualizarEstado,      
} from '../controllers/usuarioController.js';

const router = express.Router();

// Ruta para obtener usuarios activos (no eliminados)
router.get('/estado', obtenerUsuariosEstado);

// Ruta para cargar usuarios masivamente
router.post('/carga-masiva', cargaMasivaUsuarios);

// Ruta para crear un usuario
router.post('/crear', crearUsuario);

// Ruta para obtener todos los usuarios
router.get('/', obtenerUsuarios);

// Ruta para actualizar el estado de un usuario
router.put('/estado/:id', actualizarEstado);

// Ruta para obtener un usuario por ID
router.get('/:id', obtenerUsuarioPorId);

// Ruta para actualizar un usuario
router.put('/:id', actualizarUsuario);

// Ruta para eliminar un usuario lógicamente
router.delete('/:id', eliminarUsuario);

export default router;

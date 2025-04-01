import express from 'express';
import { asignarRolAUsuario, obtenerRolesDeUsuario, obtenerUsuariosDeRol, eliminarRolDeUsuario } from '../controllers/rolUsuariosController.js';

const router = express.Router();

// Ruta para asignar un rol a un usuario
router.post('/asignar', asignarRolAUsuario);

// Ruta para obtener los roles de un usuario
router.get('/usuario/:idUsuario/roles', obtenerRolesDeUsuario);

// Ruta para obtener los usuarios de un rol
router.get('/rol/:idRol/usuarios', obtenerUsuariosDeRol);

// Ruta para eliminar un rol de un usuario
router.delete('/eliminar/:Rol_idRol/:usuarios_idUsuario', eliminarRolDeUsuario);

export default router;

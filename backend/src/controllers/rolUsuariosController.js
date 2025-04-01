import { RolUsuarios } from '../models/RolUsuarios.js';
import { Rol } from '../models/Rol.js';
import { Usuarios } from '../models/Usuarios.js';

export const asignarRolAUsuario = async (req, res) => {
  try {
    const { Rol_idRol, usuarios_idUsuario } = req.body;

    // Validar que el rol y el usuario existan
    const rol = await Rol.findByPk(Rol_idRol);
    const usuario = await Usuarios.findByPk(usuarios_idUsuario);

    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Asignar rol al usuario
    const rolUsuario = await RolUsuarios.create({
      Rol_idRol,
      usuarios_idUsuario
    });

    res.status(201).json(rolUsuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerRolesDeUsuario = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const usuario = await Usuarios.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener roles del usuario
    const roles = await usuario.getRoles();  // Usamos la relación definida en el modelo
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerUsuariosDeRol = async (req, res) => {
  const { idRol } = req.params;
  try {
    const rol = await Rol.findByPk(idRol);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Obtener usuarios del rol
    const usuarios = await rol.getUsuarios();  // Usamos la relación definida en el modelo
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const eliminarRolDeUsuario = async (req, res) => {
  const { Rol_idRol, usuarios_idUsuario } = req.params;

  try {
    const rolUsuario = await RolUsuarios.findOne({
      where: {
        Rol_idRol,
        usuarios_idUsuario,
        isDeleted: false,
      }
    });

    if (!rolUsuario) {
      return res.status(404).json({ error: 'Relación entre rol y usuario no encontrada' });
    }

    // Marcar la relación como eliminada
    rolUsuario.isDeleted = true;
    await rolUsuario.save();

    res.status(200).json({ message: 'Rol eliminado del usuario correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

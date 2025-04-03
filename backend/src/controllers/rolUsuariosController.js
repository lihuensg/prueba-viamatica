import { RolUsuarios } from '../models/RolUsuarios.js';
import { Rol } from '../models/Rol.js';
import { Usuarios } from '../models/Usuarios.js';

// Asignar un rol a un usuario
export const asignarRolAUsuario = async (req, res) => {
  try {
    const { Rol_idRol, usuarios_idUsuario } = req.body;

    // Verifica si ya existe la relación en la tabla
    const existe = await RolUsuarios.findOne({
      where: { Rol_idRol, usuarios_idUsuario }
    });

    if (existe) {
      return res.status(400).json({ message: "El usuario ya tiene este rol asignado." });
    }

    // Si no existe, inserta la nueva relación
    const nuevoRolUsuario = await RolUsuarios.create({
      Rol_idRol,
      usuarios_idUsuario,
      isDeleted: false
    });

    res.status(201).json(nuevoRolUsuario);
  } catch (error) {
    console.error("Error al asignar rol:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Obtener todos los roles de un usuario
export const obtenerRolesDeUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const usuario = await Usuarios.findByPk(idUsuario, {
      include: [
        {
          model: Rol,
          through: { attributes: [] }, // Evita traer datos innecesarios de la tabla intermedia
          as: "roles" // Usa el alias correcto según tu modelo
        }
      ]
    });

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json(usuario.roles);
  } catch (err) {
    console.error("Error al obtener roles del usuario:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los usuarios con un rol específico
export const obtenerUsuariosDeRol = async (req, res) => {
  try {
    const { idRol } = req.params;

    const rol = await Rol.findByPk(idRol, {
      include: [
        {
          model: Usuarios,
          through: { attributes: [] }, // Evita traer datos de la tabla intermedia
          as: "usuarios" // Usa el alias correcto según tu modelo
        }
      ]
    });

    if (!rol) return res.status(404).json({ error: "Rol no encontrado" });

    res.status(200).json(rol.usuarios);
  } catch (err) {
    console.error("Error al obtener usuarios del rol:", err);
    res.status(500).json({ error: err.message });
  }
};

// Modificar el rol de un usuario
export const modificarRolDeUsuario = async (req, res) => {
  try {
    const { usuarios_idUsuario, nuevoRol_idRol } = req.body;

    // Validar existencia de usuario y rol
    const usuario = await Usuarios.findByPk(usuarios_idUsuario);
    const nuevoRol = await Rol.findByPk(nuevoRol_idRol);

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    if (!nuevoRol) return res.status(404).json({ error: "Rol no encontrado" });

    // Verifica si el usuario ya tiene el nuevo rol asignado
    const existe = await RolUsuarios.findOne({
      where: { usuarios_idUsuario, Rol_idRol: nuevoRol_idRol }
    });

    if (existe) {
      return res.status(400).json({ message: "El usuario ya tiene este rol asignado." });
    }

    // Eliminar solo el rol anterior del usuario
    await RolUsuarios.destroy({ where: { usuarios_idUsuario } });

    // Asignar el nuevo rol
    const nuevoRolUsuario = await RolUsuarios.create({
      Rol_idRol: nuevoRol_idRol,
      usuarios_idUsuario
    });

    res.status(200).json({ message: "Rol actualizado correctamente", nuevoRolUsuario });
  } catch (err) {
    console.error("Error al modificar rol:", err);
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un rol específico de un usuario
export const eliminarRolDeUsuario = async (req, res) => {
  try {
    const { Rol_idRol, usuarios_idUsuario } = req.body;

    const rolUsuario = await RolUsuarios.findOne({
      where: { Rol_idRol, usuarios_idUsuario }
    });

    if (!rolUsuario) return res.status(404).json({ error: "Rol no asignado al usuario" });

    await rolUsuario.destroy();

    res.status(200).json({ message: "Rol eliminado del usuario correctamente" });
  } catch (err) {
    console.error("Error al eliminar rol del usuario:", err);
    res.status(500).json({ error: err.message });
  }
};

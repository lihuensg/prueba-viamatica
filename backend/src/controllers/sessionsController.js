import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuarios } from "../models/Usuarios.js";
import { Rol } from "../models/Rol.js";
import { Sessions } from "../models/Sessions.js";

export const iniciarSesion = async (req, res) => {
  try {
    const { mail, userName, password } = req.body;

    // Buscar usuario por correo o username
    const usuario = await Usuarios.findOne({
      where: { [Op.or]: [{ Mail: mail }, { UserName: userName }] },
      include: [{ model: Rol, as: "roles" }],
    });

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Verificar si el usuario está bloqueado
    if (usuario.Status === "bloqueado") {
      return res.status(403).json({ error: "Usuario bloqueado. Contacta al administrador." });
    }

    // Verificar si ya hay una sesión activa
    const sessionActiva = await Sessions.findOne({
      where: { usuarios_idUsuario: usuario.id, isDeleted: false, FechaCierre: null },
    });

    if (sessionActiva) {
      return res.status(400).json({ error: "Ya tienes una sesión activa." });
    }

    // Verificar contraseña
    const esCorrecta = await bcrypt.compare(password, usuario.Password);
    if (!esCorrecta) {
      usuario.intentosFallidos = (usuario.intentosFallidos || 0) + 1;
      await usuario.save();
    
      await Sessions.create({
        FechaIngreso: new Date(),
        Exitoso: false,
        usuarios_idUsuario: usuario.id
      });
    
      if (usuario.intentosFallidos >= 3) {
        usuario.Status = "bloqueado";
        await usuario.save();
        return res.status(403).json({ error: "Usuario bloqueado por 3 intentos fallidos" });
      }
    
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Resetear intentos fallidos
    usuario.intentosFallidos = 0;
    await usuario.save();

    // Crear sesión
    const session = await Sessions.create({
      FechaIngreso: new Date(),
      usuarios_idUsuario: usuario.id,
    });

    // Obtener roles del usuario
    const rolesUsuario = usuario.roles.map((r) => r.RolName);

    // Generar token con datos del usuario
    const token = jwt.sign(
      { idUsuario: usuario.id, sessionId: session.id, rol: rolesUsuario },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Inicio de sesión exitoso", token, sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const cerrarSesion = async (req, res) => {
  try {
    const { sessionId } = req.usuario;

    if (!sessionId) {
      return res.status(400).json({ error: "No se encontró la sesión en el token." });
    }

    const session = await Sessions.findOne({
      where: { id: sessionId, isDeleted: false, FechaCierre: null },
    });

    if (!session) {
      return res.status(404).json({ error: "Sesión no encontrada o ya cerrada." });
    }

    session.FechaCierre = new Date();
    await session.save();

    return res.json({ message: "Sesión cerrada exitosamente." });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// Función para obtener el historial de sesiones (solo admins)
export const obtenerHistorialSesiones = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Verificar si el usuario autenticado tiene permisos de administrador
    if (!req.usuario.rol.includes("admin")) {
      return res.status(403).json({ error: "No tienes permisos para ver esta información." });
    }

    // Validar que el usuarioId sea válido
    if (!usuarioId) {
      return res.status(400).json({ error: "El ID del usuario es obligatorio." });
    }

    // Verificar si el usuario realmente existe
    const usuarioExiste = await Usuarios.findByPk(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({ error: "El usuario no existe." });
    }

    // Obtener el historial de sesiones
    const sesiones = await Sessions.findAll({
      where: { usuarios_idUsuario: usuarioId },
      order: [["FechaIngreso", "DESC"]],
      attributes: ["id", "FechaIngreso", "FechaCierre", "usuarios_idUsuario"]
    });

    res.status(200).json(sesiones);
  } catch (err) {
    console.error("Error al obtener el historial de sesiones:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const obtenerResumenBienvenida = async (req, res) => {
  try {
    
    const usuarioId = req.usuario.idUsuario; // asumimos que el middleware de autenticación te mete esto
    console.log("ID desde el token:", usuarioId);

    const usuarioExiste = await Usuarios.findByPk(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Última sesión exitosa
    const ultimaSesion = await Sessions.findOne({
      where: {
        usuarios_idUsuario: usuarioId,
        Exitoso: true
      },
      order: [["FechaIngreso", "DESC"]],
      attributes: ["FechaIngreso", "FechaCierre"]
    });

    // Últimos 5 intentos fallidos
    const intentosFallidos = await Sessions.findAll({
      where: {
        usuarios_idUsuario: usuarioId,
        Exitoso: false
      },
      order: [["FechaIngreso", "DESC"]],
      limit: 5,
      attributes: ["FechaIngreso"]
    });

    res.status(200).json({
      usuario: {
        nombre: usuarioExiste.UserName,
        email: usuarioExiste.Mail
      },
      ultimaSesion,
      intentosFallidos
    });
  } catch (error) {
    console.error("Error en obtenerResumenBienvenida:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};


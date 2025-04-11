import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuarios } from "../models/Usuarios.js";
import { Rol } from "../models/Rol.js";
import { Sessions } from "../models/Sessions.js";
import { sequelize } from "../database/database.js";


export const iniciarSesion = async (req, res) => {
  try {
    const { mail, userName, password } = req.body;

    // Buscar usuario por correo o username
    const usuario = await Usuarios.findOne({
      where: { [Op.or]: [{ Mail: mail }, { UserName: userName }] },
      include: [{ model: Rol, as: "roles" }],
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el usuario está bloqueado
    if (usuario.Status === "bloqueado") {
      return res.status(403).json({ error: "Usuario bloqueado. Contacta al administrador." });
    }

    // Verificar contraseña
    const esCorrecta = await bcrypt.compare(password, usuario.Password);

    if (!esCorrecta) {
      // Contar intentos fallidos en los últimos intentos (opcional: filtrar por fecha si querés)
      const intentosFallidos = await Sessions.count({
        where: {
          usuarios_idUsuario: usuario.id,
          Exitoso: false,
        },
      });

      const nuevoIntento = intentosFallidos + 1;

      // Registrar intento fallido
      await Sessions.create({
        FechaIngreso: new Date(),
        FechaCierre: new Date(),
        isDeleted: true,
        Exitoso: false,
        usuarios_idUsuario: usuario.id,
      });

      if (nuevoIntento >= 3) {
        usuario.Status = "bloqueado";
        await usuario.save();

        return res.status(403).json({ error: "Usuario bloqueado por 3 intentos fallidos" });
      }

      const intentosRestantes = 3 - nuevoIntento;

      return res.status(400).json({
        error: "Contraseña incorrecta",
        intentosRestantes,
      });
    }

    // Verificar si ya hay una sesión activa
    const sessionActiva = await Sessions.findOne({
      where: {
        usuarios_idUsuario: usuario.id,
        isDeleted: false,
        FechaCierre: null,
      },
    });

    if (sessionActiva) {
      return res.status(400).json({ error: "Ya tienes una sesión activa." });
    }

    // Crear sesión exitosa
    const session = await Sessions.create({
      FechaIngreso: new Date(),
      usuarios_idUsuario: usuario.id,
      Exitoso: true,
      isDeleted: false,
    });

    const rolesUsuario = usuario.roles.map((r) => r.RolName);

    // Generar token
    const token = jwt.sign(
      {
        idUsuario: usuario.id,
        sessionId: session.id,
        rol: rolesUsuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      sessionId: session.id,
    });

  } catch (err) {
    console.error("🔥 Error en iniciarSesion:", err.message);
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
        Exitoso: true,
        FechaCierre: { [Op.not]: null } 
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

export const obtenerResumenDashboard = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;
    const roles = req.usuario.rol;

    if (!roles.includes("admin")) {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    // 1. Obtener todos los usuarios
    const usuarios = await Usuarios.findAll({
      attributes: ["id", "UserName", "Status"]
    });

    // 2. Obtener todas las sesiones activas
    const sesionesActivas = await Sessions.findAll({
      where: { isDeleted: false, FechaCierre: null },
      attributes: ["usuarios_idUsuario"],
      group: ["usuarios_idUsuario"]
    });

    const idsActivos = sesionesActivas.map(s => s.usuarios_idUsuario);

    // 3. Obtener intentos fallidos agrupados por usuario
    const intentosFallidos = await Sessions.findAll({
      where: { Exitoso: false },
      attributes: [
        "usuarios_idUsuario",
        [sequelize.fn("COUNT", sequelize.col("id")), "cantidad"]
      ],
      group: ["usuarios_idUsuario"]
    });

    // Mapeamos los intentos fallidos por usuarioId
    const intentosMap = {};
    intentosFallidos.forEach(f => {
      intentosMap[f.usuarios_idUsuario] = f.dataValues.cantidad;
    });

    // 4. Clasificamos usuarios según su estado + sesiones activas
    const usuariosActivos = [];
    const usuariosInactivos = [];
    const usuariosBloqueados = [];

    usuarios.forEach(u => {
      const intentos = intentosMap[u.id] || 0;
      const data = {
        nombre: u.UserName,
        intentosFallidos: intentos
      };

      if (u.Status === "bloqueado") {
        usuariosBloqueados.push(data);
      } else if (idsActivos.includes(u.id)) {
        usuariosActivos.push(data);
      } else {
        usuariosInactivos.push(data);
      }
    });

    res.status(200).json({
      activos: usuariosActivos,
      inactivos: usuariosInactivos,
      bloqueados: usuariosBloqueados
    });
  } catch (err) {
    console.error("Error en obtenerResumenDashboard:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

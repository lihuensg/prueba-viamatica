// src/controllers/sessionController.js
import { Sessions } from '../models/Sessions.js';
import { Usuarios } from '../models/Usuarios.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

// Función para iniciar sesión
export const iniciarSesion = async (req, res) => {
  try {
    const { correo, username, password } = req.body;

    // Buscar usuario por correo o nombre de usuario
    const usuario = await Usuarios.findOne({
      where: {
        [Op.or]: [{ email: correo }, { username: username }],
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario está bloqueado
    if (usuario.status === 'bloqueado') {
      return res.status(403).json({ error: 'Usuario bloqueado. Contacta al administrador.' });
    }

    // Verificar si el usuario ya tiene una sesión activa
    const sessionActiva = await Sessions.findOne({
      where: {
        usuarios_idUsuario: usuario.idUsuario,
        isDeleted: false,
        FechaCierre: null,
      },
    });

    if (sessionActiva) {
      return res.status(400).json({ error: 'Ya tienes una sesión activa.' });
    }

    // Verificar la contraseña
    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) {
      // Si la contraseña es incorrecta, incrementar contador de intentos fallidos
      usuario.intentosFallidos += 1;
      await usuario.save();

      if (usuario.intentosFallidos >= 3) {
        usuario.status = 'bloqueado';
        await usuario.save();
        return res.status(403).json({ error: 'Usuario bloqueado por 3 intentos fallidos' });
      }

      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Si la contraseña es correcta, resetear los intentos fallidos
    usuario.intentosFallidos = 0;
    await usuario.save();

    // Crear una nueva sesión
    const session = await Sessions.create({
      FechaIngreso: new Date(),
      usuarios_idUsuario: usuario.idUsuario,
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso', sessionId: session.idSesion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para cerrar sesión
export const cerrarSesion = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Buscar la sesión activa
    const session = await Sessions.findOne({
      where: {
        idSesion: sessionId,
        isDeleted: false,
        FechaCierre: null,
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    // Marcar la sesión como cerrada
    session.FechaCierre = new Date();
    await session.save();

    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

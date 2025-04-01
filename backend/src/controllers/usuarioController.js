import { Usuarios } from '../models/Usuarios.js';
import bcrypt from 'bcrypt';
import { validarPassword, generarCorreo, validarUsername } from '../utils/validaciones.js';

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, identificacion, password } = req.body;

    // Generar correo
    const correo = generarCorreo(nombre, apellido, identificacion);

    // Validaciones de nombre de usuario
    const username = validarUsername(nombre, apellido);

    // Validación de contraseña
    if (!validarPassword(password)) {
      return res.status(400).json({ error: 'Contraseña no válida. Debe contener al menos una mayúscula, un número y un carácter especial.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuarios.create({
      nombre,
      apellido,
      identificacion,
      email: correo,
      username,
      password: hashedPassword, // Guardar la contraseña encriptada
    });

    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      where: {
        isDeleted: false, // Filtramos los usuarios eliminados lógicamente
      }
    });
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findByPk(id, {
      where: {
        isDeleted: false, // Aseguramos que no se devuelvan usuarios eliminados
      }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, identificacion, email, username, password, status } = req.body;

  try {
    const usuario = await Usuarios.findByPk(id, {
      where: {
        isDeleted: false, // Aseguramos que no se actualicen usuarios eliminados
      }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si la contraseña se proporciona, encriptarla
    let hashedPassword = usuario.password;
    if (password) {
      if (!validarPassword(password)) {
        return res.status(400).json({ error: 'Contraseña no válida' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await usuario.update({
      nombre,
      apellido,
      identificacion,
      email,
      username,
      password: hashedPassword,
      status,
    });

    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findByPk(id, {
      where: {
        isDeleted: false, // Solo eliminamos usuarios activos
      }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Marcar el usuario como eliminado lógicamente
    usuario.isDeleted = true;
    await usuario.save();

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

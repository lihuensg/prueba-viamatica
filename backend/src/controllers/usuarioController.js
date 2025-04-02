import { Usuarios } from "../models/Usuarios.js";
import { Persona } from "../models/Persona.js"; // Modelo de Persona
import bcrypt from "bcrypt";
import {
  validarPassword,
  generarCorreo,
  validarUsername,
} from "../utils/validaciones.js";

export const crearUsuario = async (req, res) => {
  try {
    const { Persona_idPersona2, password } = req.body;

    // Buscar la persona asociada
    const persona = await Persona.findByPk(Persona_idPersona2);

    if (!persona) {
      return res
        .status(404)
        .json({ error: "No se encontró la persona asociada." });
    }

    // Generar correo basado en la persona
    let correo = generarCorreo(
      persona.Nombres,
      persona.Apellidos,
      persona.Identificacion
    );

    // Verificar si el correo ya existe y generar uno único
    let contador = 1;
    let correoUnico = correo;
    while (await Usuarios.findOne({ where: { Mail: correoUnico } })) {
      correoUnico = `${correo.split("@")[0]}${contador}@mail.com`;
      contador++;
    }

    // Generar nombre de usuario
    const username = validarUsername(persona.Nombres, persona.Apellidos);

    // Validación de contraseña
    if (!validarPassword(password)) {
      return res
        .status(400)
        .json({
          error:
            "Contraseña no válida. Debe contener al menos una mayúscula, un número y un carácter especial.",
        });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await Usuarios.create({
      Persona_idPersona2, // Relación con la persona
      Identificacion: persona.Identificacion, // Se obtiene de la tabla Persona
      Mail: correoUnico,
      UserName: username,
      Password: hashedPassword, // Guardar la contraseña encriptada
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
      },
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
      },
    });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    identificacion,
    email,
    username,
    password,
    status,
  } = req.body;

  try {
    const usuario = await Usuarios.findByPk(id, {
      where: {
        isDeleted: false, // Aseguramos que no se actualicen usuarios eliminados
      },
    });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si la contraseña se proporciona, encriptarla
    let hashedPassword = usuario.password;
    if (password) {
      if (!validarPassword(password)) {
        return res.status(400).json({ error: "Contraseña no válida" });
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
      },
    });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Marcar el usuario como eliminado lógicamente
    usuario.isDeleted = true;
    await usuario.save();

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

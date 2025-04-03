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

    const persona = await Persona.findByPk(Persona_idPersona2);
    if (!persona) {
      return res.status(404).json({ error: "No se encontró la persona asociada." });
    }

    // Validar que la persona no tenga un usuario ya asociado
    const correoUnico = await generarCorreo(persona.Nombres, persona.Apellidos, persona.Identificacion);
    const username = await validarUsername(persona.Nombres, persona.Apellidos);

    if (!validarPassword(password)) {
      return res.status(400).json({ 
        error: "Contraseña no válida. Debe contener al menos 8 digitos. Debe contener al menos una mayúscula, un número y un carácter especial." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuarios.create({
      Persona_idPersona2,
      Identificacion: persona.Identificacion,
      Mail: correoUnico,
      UserName: username,
      Password: hashedPassword,
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
  const { email, username, password } = req.body;

  try {
    const usuario = await Usuarios.findByPk(id);

    if (!usuario || usuario.isDeleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si otro usuario ya tiene el email
    if (email && email !== usuario.Mail) {
      const emailExistente = await Usuarios.findOne({
        where: { Mail: email },
      });

      if (emailExistente) {
        return res.status(400).json({ error: "El correo ya está en uso." });
      }
    }

    // Verificar si otro usuario ya tiene el username
    if (username && username !== usuario.UserName) {
      const usernameExistente = await Usuarios.findOne({
        where: { UserName: username },
      });

      if (usernameExistente) {
        return res.status(400).json({ error: "El nombre de usuario ya está en uso." });
      }
    }

    // Encriptar la nueva contraseña si se proporciona
    let hashedPassword = usuario.Password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar los datos
    await usuario.update({
      Mail: email || usuario.Mail, 
      UserName: username || usuario.UserName,
      Password: hashedPassword,
    });

    res.status(200).json({ message: "Usuario actualizado correctamente", usuario });
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

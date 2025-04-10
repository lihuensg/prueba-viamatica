import { Usuarios } from "../models/Usuarios.js";
import { Persona } from "../models/Persona.js"; // Modelo de Persona
import bcrypt from "bcrypt";
import { validarPassword, generarCorreo, validarUsername } from "../utils/validaciones.js";
import multer from 'multer';
import * as XLSX from 'xlsx';
import fs from 'fs';
export const crearUsuario = async (req, res) => {
  try {
    const { Persona_idPersona2, password } = req.body;

    // Buscar la persona por su ID
    const persona = await Persona.findByPk(Persona_idPersona2);
    if (!persona) {
      return res.status(404).json({ error: "No se encontró la persona asociada." });
    }

    // Verificar si ya tiene un usuario activo
    const usuarioActivo = await Usuarios.findOne({
      where: { Persona_idPersona2, Status: "activo" }
    });

    if (usuarioActivo) {
      return res.status(400).json({ error: "No se puede crear un nuevo usuario mientras exista uno activo." });
    }

    // Generar correo y username únicos
    const correoUnico = await generarCorreo(persona.Nombres, persona.Apellidos, persona.Identificacion);
    const username = await validarUsername(persona.Nombres, persona.Apellidos);

    // Validar la contraseña
    if (!validarPassword(password)) {
      return res.status(400).json({ error: "Contraseña no válida." });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const usuario = await Usuarios.create({
      Persona_idPersona2,
      Identificacion: persona.Identificacion,  // Puede repetirse ahora
      Mail: correoUnico,
      UserName: username,
      Password: hashedPassword,
      Status: "activo", 
    });

    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
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
    const usuario = await Usuarios.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (usuario.Status === "inactivo") {
      return res.status(400).json({ error: "El usuario ya está inactivo." });
    }

    // Cambiar el estado a "inactivo" y marcar isDeleted como true
    usuario.Status = "inactivo";
    usuario.isDeleted = true;
    await usuario.save();

    res.status(200).json({ message: "Usuario inactivo correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const upload = multer({ dest: 'uploads/' });

export const cargaMasivaUsuarios = [
  upload.single('archivo'),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'No se subió ningún archivo' });

      const buffer = fs.readFileSync(req.file.path);
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const resultados = {
        insertados: 0,
        errores: []
      };

      for (const row of data) {
        try {
          const personaId = row.Persona_id;
          const password = row.Password;

          if (!personaId || !password) {
            resultados.errores.push({ row, error: 'Falta ID de persona o contraseña' });
            continue;
          }

          const persona = await Persona.findByPk(personaId);
          if (!persona) {
            resultados.errores.push({ row, error: 'No se encontró la persona' });
            continue;
          }

          const usuarioActivo = await Usuarios.findOne({
            where: { Persona_idPersona2: personaId, Status: 'activo' }
          });

          if (usuarioActivo) {
            resultados.errores.push({ row, error: 'Ya tiene usuario activo' });
            continue;
          }

          if (!validarPassword(password)) {
            resultados.errores.push({ row, error: 'Contraseña inválida' });
            continue;
          }

          const correo = await generarCorreo(persona.Nombres, persona.Apellidos, persona.Identificacion);
          const username = await validarUsername(persona.Nombres, persona.Apellidos);
          const hashed = await bcrypt.hash(password, 10);

          await Usuarios.create({
            Persona_idPersona2: personaId,
            Identificacion: persona.Identificacion,
            Mail: correo,
            UserName: username,
            Password: hashed,
            Status: 'activo'
          });

          resultados.insertados++;
        } catch (error) {
          resultados.errores.push({ row, error: 'Error interno' });
        }
      }

      // eliminar archivo temporal
      fs.unlinkSync(file.path);

      res.status(200).json(resultados);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al procesar el archivo' });
    }
  }
];

export const obtenerUsuariosEstado = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      where: {
        isDeleted: false, // Filtramos los usuarios eliminados lógicamente
      },
      attributes: ['id', 'UserName', 'Status'], // Solo obtenemos los campos necesarios
    });
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body; // El nuevo estado que se desea establecer

  try {
    // Verificar si el usuario existe
    const usuario = await Usuarios.findByPk(id);

    if (!usuario || usuario.isDeleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el estado nuevo es válido (uno de los valores posibles)
    if (!['activo', 'bloqueado', 'inactivo'].includes(newStatus)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    // Actualizar el estado del usuario
    usuario.Status = newStatus;
    await usuario.save();

    res.status(200).json({ message: "Estado actualizado correctamente", usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

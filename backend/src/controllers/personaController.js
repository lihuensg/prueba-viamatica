import { Persona } from "../models/Persona.js";
import {
  validarIdentificacion,
  validarFechaNacimiento,
} from "../utils/validaciones.js";

export const crearPersona = async (req, res) => {
  try {
    const { Nombres, Apellidos, Identificacion, FechaNacimiento } = req.body;

    // Validar identificación
    if (!validarIdentificacion(Identificacion)) {
      return res.status(400).json({
        error: "Identificación no válida. Debe tener 10 dígitos, solo números y no contener cuatro números seguidos repetidos.",
      });
    }

    // Validar fecha de nacimiento
    if (!validarFechaNacimiento(FechaNacimiento)) {
      return res.status(400).json({ error: "Fecha de nacimiento no válida." });
    }

    const persona = await Persona.create({
      Nombres,
      Apellidos,
      Identificacion,
      FechaNacimiento,
      isDeleted: false,
    });

    res.status(201).json(persona);
  } catch (err) {
    console.error("Error en crearPersona:", err);
    res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
  }
};

export const obtenerPersonas = async (req, res) => {
  try {
    const personas = await Persona.findAll({ where: { isDeleted: false } });
    res.status(200).json(personas);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerPersonaPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const persona = await Persona.findOne({
      where: { idPersona: id, isDeleted: false },
    });
    if (!persona)
      return res.status(404).json({ error: "Persona no encontrada" });

    res.status(200).json(persona);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/*export const actualizarPersona = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const persona = await Persona.findOne({
      where: { idPersona: id, isDeleted: false },
    });
    if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

    const { Nombres, Apellidos, Identificacion, FechaNacimiento } = req.body;

    // Validaciones solo si los valores están presentes en el request
    if (Identificacion && !validarIdentificacion(Identificacion)) {
      return res.status(400).json({ error: "Identificación no válida." });
    }
    if (FechaNacimiento && !validarFechaNacimiento(FechaNacimiento)) {
      return res.status(400).json({ error: "Fecha de nacimiento no válida." });
    }

    // Solo actualiza los valores enviados en la solicitud
    await persona.update({
      ...(Nombres && { Nombres }),
      ...(Apellidos && { Apellidos }),
      ...(Identificacion && { Identificacion }),
      ...(FechaNacimiento && { FechaNacimiento }),
    });

    res.status(200).json(persona);
  } catch (err) {
    console.error("Error en actualizarPersona:", err);
    res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
  }
};
*/

export const eliminarPersona = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    // Actualiza directamente y devuelve la cantidad de filas afectadas
    const [filasActualizadas] = await Persona.update(
      { isDeleted: true },
      { where: { idPersona: id, isDeleted: false } }
    );

    if (filasActualizadas === 0) {
      return res.status(404).json({ error: "Persona no encontrada o ya eliminada" });
    }

    res.status(200).json({ message: "Persona eliminada correctamente" });
  } catch (err) {
    console.error("🔥 Error en eliminarPersona:", err);
    res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
  }
};

export const actualizarPersona = async (req, res) => {
  const { id } = req.params; // idPersona que se quiere actualizar
  const datosActualizados = req.body;
  const { idUsuario, rol } = req.user; // del token decodificado

  try {
    // Buscar la persona a modificar
    const persona = await Persona.findByPk(id);
    if (!persona) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    // Buscar el usuario actual (logueado)
    const usuarioLogueado = await Usuarios.findByPk(idUsuario);

    // Buscar usuario relacionado con la persona que se quiere modificar
    const usuarioDeLaPersona = await Usuarios.findOne({
      where: { Persona_idPersona2: id }
    });

    // Obtener roles del usuario de la persona
    const rolesRelacionados = await usuarioDeLaPersona?.getRoles({
      where: { isDeleted: false }
    });
    const rolesRelacionadosNombres = rolesRelacionados?.map(r => r.RolName) || [];

    const esAdmin = rol.includes("ADMIN");

    // Si NO es admin, solo puede editar su propia persona
    if (!esAdmin) {
      if (usuarioDeLaPersona?.idUsuario !== idUsuario) {
        return res.status(403).json({ error: "No puedes modificar a otra persona." });
      }

      // Campos que puede modificar un usuario común
      const camposPermitidos = ["Nombres", "Apellidos", "FechaNacimiento"];
      const camposNoPermitidos = Object.keys(datosActualizados).filter(
        campo => !camposPermitidos.includes(campo)
      );

      if (camposNoPermitidos.length > 0) {
        return res.status(400).json({
          error: `No puedes modificar los campos: ${camposNoPermitidos.join(", ")}`
        });
      }
    } else {
      // Si es admin, NO puede editar a otro admin
      if (
        usuarioDeLaPersona &&
        usuarioDeLaPersona.idUsuario !== idUsuario &&
        rolesRelacionadosNombres.includes("ADMIN")
      ) {
        return res.status(403).json({ error: "No puedes modificar a otro administrador." });
      }

      // Podés permitir que el admin edite todos los campos excepto el ID
      delete datosActualizados.idPersona;
    }

    // Todo OK, actualizar
    await persona.update(datosActualizados);
    res.status(200).json({ message: "Persona actualizada correctamente", persona });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la persona", detalle: error.message });
  }
};
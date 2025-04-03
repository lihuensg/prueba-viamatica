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

export const actualizarPersona = async (req, res) => {
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


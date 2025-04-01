import { Persona } from '../models/Persona.js';
import { validarIdentificacion, validarFechaNacimiento } from '../utils/validaciones.js';

export const crearPersona = async (req, res) => {
  try {
    const { Nombres, Apellidos, Identificacion, FechaNacimiento } = req.body;

    // Validación de identificación
    if (!validarIdentificacion(Identificacion)) {
      return res.status(400).json({ error: 'Identificación no válida. Debe tener 10 caracteres.' });
    }

    // Validación de fecha de nacimiento
    if (!validarFechaNacimiento(FechaNacimiento)) {
      return res.status(400).json({ error: 'Fecha de nacimiento no válida.' });
    }

    const persona = await Persona.create({
      Nombres,
      Apellidos,
      Identificacion,
      FechaNacimiento,
    });

    res.status(201).json(persona);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerPersonas = async (req, res) => {
  try {
    const personas = await Persona.findAll({
      where: {
        isDeleted: false, // Filtramos las personas no eliminadas
      }
    });
    res.status(200).json(personas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerPersonaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const persona = await Persona.findByPk(id, {
      where: {
        isDeleted: false, // Aseguramos que no se devuelvan personas eliminadas
      }
    });
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.status(200).json(persona);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarPersona = async (req, res) => {
  const { id } = req.params;
  const { Nombres, Apellidos, Identificacion, FechaNacimiento } = req.body;

  try {
    const persona = await Persona.findByPk(id, {
      where: {
        isDeleted: false, // Aseguramos que no se actualicen personas eliminadas
      }
    });
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    // Validaciones
    if (!validarIdentificacion(Identificacion)) {
      return res.status(400).json({ error: 'Identificación no válida.' });
    }

    if (!validarFechaNacimiento(FechaNacimiento)) {
      return res.status(400).json({ error: 'Fecha de nacimiento no válida.' });
    }

    await persona.update({
      Nombres,
      Apellidos,
      Identificacion,
      FechaNacimiento,
    });

    res.status(200).json(persona);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const eliminarPersona = async (req, res) => {
  const { id } = req.params;
  try {
    const persona = await Persona.findByPk(id, {
      where: {
        isDeleted: false, // Solo eliminamos personas activas
      }
    });
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    // Marcar la persona como eliminada lógicamente
    persona.isDeleted = true;
    await persona.save();

    res.status(200).json({ message: 'Persona eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
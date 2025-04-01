import { Persona } from '../models/Persona.js';
import { validarIdentificacion, validarFechaNacimiento } from '../utils/validaciones.js';

export const crearPersona = async (req, res) => {
  try {
    const { Nombres, Apellidos, Identificacion, FechaNacimiento } = req.body;

    // Validaciones
    if (!validarIdentificacion(Identificacion)) {
      return res.status(400).json({ error: 'Identificación no válida. Debe tener 10 caracteres.' });
    }
    if (!validarFechaNacimiento(FechaNacimiento)) {
      return res.status(400).json({ error: 'Fecha de nacimiento no válida.' });
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const obtenerPersonas = async (req, res) => {
  try {
    const personas = await Persona.findAll({ where: { isDeleted: false } });
    res.status(200).json(personas);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const obtenerPersonaPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const persona = await Persona.findOne({ where: { idPersona: id, isDeleted: false } });
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });

    res.status(200).json(persona);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const actualizarPersona = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const persona = await Persona.findOne({ where: { idPersona: id, isDeleted: false } });
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });

    const { Nombres, Apellidos, Identificacion, FechaNacimiento } = req.body;
    
    if (!validarIdentificacion(Identificacion)) {
      return res.status(400).json({ error: 'Identificación no válida.' });
    }
    if (!validarFechaNacimiento(FechaNacimiento)) {
      return res.status(400).json({ error: 'Fecha de nacimiento no válida.' });
    }

    await persona.update({ Nombres, Apellidos, Identificacion, FechaNacimiento });
    res.status(200).json(persona);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const eliminarPersona = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const persona = await Persona.findOne({ where: { idPersona: id, isDeleted: false } });
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });

    await persona.update({ isDeleted: true });
    res.status(200).json({ message: 'Persona eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

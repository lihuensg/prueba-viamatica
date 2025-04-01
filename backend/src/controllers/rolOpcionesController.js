import { RolOpciones } from '../models/RolOpciones.js';
import { Rol } from '../models/Rol.js';

export const crearRolOpcion = async (req, res) => {
  try {
    const { NombreOpcion, Rol_idRol } = req.body;

    // Validar que el nombre de la opción y el rol estén presentes
    if (!NombreOpcion || !Rol_idRol) {
      return res.status(400).json({ error: 'El nombre de la opción y el rol son obligatorios.' });
    }

    // Crear la opción para el rol
    const rolOpcion = await RolOpciones.create({
      NombreOpcion,
      Rol_idRol,
    });

    res.status(201).json(rolOpcion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerRolOpciones = async (req, res) => {
  try {
    const rolOpciones = await RolOpciones.findAll({
      where: {
        isDeleted: false, // Filtrar las opciones no eliminadas
      },
      include: [{
        model: Rol,
        attributes: ['idRol', 'RolName'], // Incluir el nombre del rol
      }]
    });
    res.status(200).json(rolOpciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerRolOpcionPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const rolOpcion = await RolOpciones.findByPk(id, {
      where: {
        isDeleted: false, // Filtrar opciones no eliminadas
      },
      include: [{
        model: Rol,
        attributes: ['idRol', 'RolName'],
      }]
    });
    if (!rolOpcion) {
      return res.status(404).json({ error: 'Opción de rol no encontrada' });
    }
    res.status(200).json(rolOpcion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarRolOpcion = async (req, res) => {
  const { id } = req.params;
  const { NombreOpcion, Rol_idRol } = req.body;

  try {
    const rolOpcion = await RolOpciones.findByPk(id, {
      where: {
        isDeleted: false, // Filtrar opciones no eliminadas
      }
    });
    if (!rolOpcion) {
      return res.status(404).json({ error: 'Opción de rol no encontrada' });
    }

    // Actualizar la opción del rol
    await rolOpcion.update({
      NombreOpcion,
      Rol_idRol,
    });

    res.status(200).json(rolOpcion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const eliminarRolOpcion = async (req, res) => {
  const { id } = req.params;
  try {
    const rolOpcion = await RolOpciones.findByPk(id, {
      where: {
        isDeleted: false, // Filtrar opciones no eliminadas
      }
    });
    if (!rolOpcion) {
      return res.status(404).json({ error: 'Opción de rol no encontrada' });
    }

    // Marcar la opción como eliminada
    rolOpcion.isDeleted = true;
    await rolOpcion.save();

    res.status(200).json({ message: 'Opción de rol eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

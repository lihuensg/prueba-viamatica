import { Rol } from '../models/Rol.js';

export const crearRol = async (req, res) => {
  try {
    const { RolName } = req.body;

    // Validar que el nombre del rol no esté vacío
    if (!RolName || RolName.trim() === '') {
      return res.status(400).json({ error: 'El nombre del rol es obligatorio.' });
    }

    const rol = await Rol.create({
      RolName,
    });

    res.status(201).json(rol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll({
      where: {
        isDeleted: false, // Filtramos los roles no eliminados
      }
    });
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerRolPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id, {
      where: {
        isDeleted: false, // Solo roles activos
      }
    });
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.status(200).json(rol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { RolName } = req.body;

  try {
    const rol = await Rol.findByPk(id, {
      where: {
        isDeleted: false, // Solo roles activos
      }
    });
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Validar que el nombre del rol no esté vacío
    if (!RolName || RolName.trim() === '') {
      return res.status(400).json({ error: 'El nombre del rol es obligatorio.' });
    }

    await rol.update({
      RolName,
    });

    res.status(200).json(rol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const eliminarRol = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id, {
      where: {
        isDeleted: false, // Solo roles activos
      }
    });
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Marcar el rol como eliminado
    rol.isDeleted = true;
    await rol.save();

    res.status(200).json({ message: 'Rol eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

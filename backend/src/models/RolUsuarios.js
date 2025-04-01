import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Rol } from './Rol.js';
import { Usuarios } from './Usuarios.js';

export const RolUsuarios = sequelize.define('RolUsuarios', {
    Rol_idRol: {
        type: DataTypes.INTEGER,
        references: {
            model: Rol,
            key: 'idRol'
        }
    },
    usuarios_idUsuario: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuarios,
            key: 'idUsuario'
        }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false  // Marca la relación como no eliminada por defecto
    }
}, {
    timestamps: false
});


// Definir relaciones
Usuarios.belongsToMany(Rol, { through: RolUsuarios, foreignKey: 'usuarios_idUsuario' });
Rol.belongsToMany(Usuarios, { through: RolUsuarios, foreignKey: 'Rol_idRol' });

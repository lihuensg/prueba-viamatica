import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Usuarios } from './Usuarios.js';

export const Sessions = sequelize.define('Sessions', {
    FechaIngreso: {
        type: DataTypes.DATE,
        allowNull: false
    },
    FechaCierre: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false  // Marca las sesiones como no eliminadas por defecto
    }
}, {
    timestamps: false
});

// Relación con Usuarios
Sessions.belongsTo(Usuarios, { foreignKey: 'usuarios_idUsuario' });

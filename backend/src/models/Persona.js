import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Persona = sequelize.define('Persona', {
    idPersona: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombres: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    Apellidos: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    Identificacion: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    FechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false  // Marca los registros como no eliminados por defecto
    }
}, {
    timestamps: false
});

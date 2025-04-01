import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Rol = sequelize.define('Rol', {
    idRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    RolName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false  // Marca los roles como no eliminados por defecto
    }
}, {
    timestamps: false
});

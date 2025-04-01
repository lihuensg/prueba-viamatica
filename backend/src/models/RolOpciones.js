import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Rol } from './Rol.js';

export const RolOpciones = sequelize.define('RolOpciones', {
    idOpcion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NombreOpcion: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false  // Marca las opciones como no eliminadas por defecto
    }
}, {
    timestamps: false
});


// Relación con Rol
Rol.hasMany(RolOpciones, { foreignKey: 'Rol_idRol' });
RolOpciones.belongsTo(Rol, { foreignKey: 'Rol_idRol' });

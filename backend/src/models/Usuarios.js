import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Persona } from './Persona.js';

export const Usuarios = sequelize.define('Usuarios', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    UserName: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        validate: {
            notNull: { msg: 'El nombre de usuario es obligatorio.' },
            len: [8, 20], // Longitud entre 8 y 20 caracteres
            isAlphanumeric: { msg: 'El nombre de usuario debe contener solo letras y números.' },
            containsUppercase(value) {
                if (!/[A-Z]/.test(value)) {
                    throw new Error('El nombre de usuario debe contener al menos una letra mayúscula.');
                }
            },
            containsNumber(value) {
                if (!/\d/.test(value)) {
                    throw new Error('El nombre de usuario debe contener al menos un número.');
                }
            },
            notContainsSpecialChars(value) {
                if (/[^a-zA-Z0-9]/.test(value)) {
                    throw new Error('El nombre de usuario no puede contener signos especiales.');
                }
            }
        }
    },
    Mail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: { msg: 'Correo electrónico inválido.' }
        }
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 255],
            containsUppercase(value) {
                if (!/[A-Z]/.test(value)) {
                    throw new Error('La contraseña debe contener al menos una letra mayúscula.');
                }
            },
            notContainSpaces(value) {
                if (/\s/.test(value)) {
                    throw new Error('La contraseña no puede contener espacios.');
                }
            },
            containsSpecialChar(value) {
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    throw new Error('La contraseña debe contener al menos un signo especial.');
                }
            }
        }
    },
    Identificacion: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: { msg: 'La identificación debe contener solo números.' },
            len: [10, 10],
            notRepeated(value) {
                if (/(.)\1{3,}/.test(value)) { // Validar si tiene 4 dígitos repetidos consecutivos
                    throw new Error('La identificación no puede tener 4 números consecutivos iguales.');
                }
            }
        }
    },
    Status: {
        type: DataTypes.ENUM('activo', 'bloqueado', 'inactivo'),
        defaultValue: 'activo',
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Relación con Persona
Usuarios.belongsTo(Persona, { foreignKey: 'Persona_idPersona2' });

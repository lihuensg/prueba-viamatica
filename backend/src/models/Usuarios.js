import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Persona } from "./Persona.js";

export const Usuarios = sequelize.define("Usuarios", {
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
      notNull: { msg: "El nombre de usuario es obligatorio." },
      len: [8, 20], // Longitud entre 8 y 20 caracteres
      isAlphanumeric: {
        msg: "El nombre de usuario debe contener solo letras y números.",
      },
      containsUppercase(value) {
        if (!/[A-Z]/.test(value)) {
          throw new Error(
            "El nombre de usuario debe contener al menos una letra mayúscula."
          );
        }
      },
      containsNumber(value) {
        if (!/\d/.test(value)) {
          throw new Error(
            "El nombre de usuario debe contener al menos un número."
          );
        }
      },
      notContainsSpecialChars(value) {
        if (/[^a-zA-Z0-9]/.test(value)) {
          throw new Error(
            "El nombre de usuario no puede contener signos especiales."
          );
        }
      },
    },
  },
  Mail: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: { msg: "Correo electrónico inválido." },
    },
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 255],
      containsUppercase(value) {
        if (!/[A-Z]/.test(value)) {
          throw new Error(
            "La contraseña debe contener al menos una letra mayúscula."
          );
        }
      },
      containsNumber(value) {
        if (!/\d/.test(value)) {
          throw new Error("La contraseña debe contener al menos un número.");
        }
      },
      notContainSpaces(value) {
        if (/\s/.test(value)) {
          throw new Error("La contraseña no puede contener espacios.");
        }
      },
      containsSpecialChar(value) {
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          throw new Error(
            "La contraseña debe contener al menos un signo especial."
          );
        }
      },
    },
  },
  Identificacion: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: { msg: "La identificación debe contener solo números." },
      len: [10, 10],
      notRepeated(value) {
        if (/(.)\1{3,}/.test(value)) {
          throw new Error(
            "La identificación no puede tener 4 números consecutivos iguales."
          );
        }
      },
    },
  },
  Status: {
    type: DataTypes.ENUM("activo", "bloqueado", "inactivo"),
    defaultValue: "activo",
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Generar correo automáticamente antes de crear el usuario
Usuarios.beforeCreate(async (usuario) => {
  if (!usuario.Mail) {
    const persona = await Persona.findByPk(Number(usuario.Persona_idPersona2));

    console.log("Persona encontrada:", persona); // <-- Agrega esto

    if (!persona) {
      throw new Error("No se encontró una persona con el ID proporcionado.");
    }

    if (!persona.Nombres || !persona.Apellidos) {
      throw new Error("La persona no tiene nombres o apellidos registrados.");
    }

    const nombres = persona.Nombres.split(" ");
    console.log("Nombres divididos:", nombres); // <-- Verifica esto

    const primeraLetra = nombres.length > 0 ? nombres[0][0].toLowerCase() : "";
    const apellido = persona.Apellidos.split(" ")[0].toLowerCase();

    usuario.Mail = `${primeraLetra}${apellido}@mail.com`;
  }
});

Persona.hasMany(Usuarios, { foreignKey: "Persona_idPersona2"  });
Usuarios.belongsTo(Persona, { foreignKey: "Persona_idPersona2" });

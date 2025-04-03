import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Rol } from "./Rol.js";
import { Usuarios } from "./Usuarios.js";

export const RolUsuarios = sequelize.define(
  "RolUsuarios",
  {
    Rol_idRol: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Parte de la clave primaria compuesta
      references: {
        model: Rol,
        key: "idRol",
      },
    },
    usuarios_idUsuario: {
      type: DataTypes.UUID,
      primaryKey: true, // Parte de la clave primaria compuesta
      references: {
        model: Usuarios,
        key: "idUsuario",
      },
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false, // Puedes cambiar a `true` si quieres `createdAt` y `updatedAt`
  }
);

// Definir relaciones con alias
Usuarios.belongsToMany(Rol, {
  through: RolUsuarios,
  foreignKey: "usuarios_idUsuario",
  as: "roles",
});

Rol.belongsToMany(Usuarios, {
  through: RolUsuarios,
  foreignKey: "Rol_idRol",
  as: "usuarios",
});

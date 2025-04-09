import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Usuarios } from "./Usuarios.js";

export const Sessions = sequelize.define(
  "Sessions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FechaIngreso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    FechaCierre: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Exitoso: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // asumimos que por defecto es exitosa
      },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    usuarios_idUsuario: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Usuarios,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

// Relación correcta
Usuarios.hasMany(Sessions, { foreignKey: "usuarios_idUsuario" });
Sessions.belongsTo(Usuarios, { foreignKey: "usuarios_idUsuario" });

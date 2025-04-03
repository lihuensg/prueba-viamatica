import express from "express";
import {
  crearRol,
  obtenerRoles,
  obtenerRolPorId,
  actualizarRol,
  eliminarRol,
} from "../controllers/rolController.js";

const router = express.Router();

// Ruta para crear un rol
router.post("/crear", crearRol);

// Ruta para obtener todos los roles
router.get("/", obtenerRoles);

// Ruta para obtener un rol por ID
router.get("/:id", obtenerRolPorId);

// Ruta para actualizar un rol
router.put("/:id", actualizarRol);

// Ruta para eliminar un rol lógicamente
router.delete("/:id", eliminarRol);

export default router;

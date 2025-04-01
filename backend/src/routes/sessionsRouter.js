import express from "express";
import {
  iniciarSesion,
  cerrarSesion,
} from "../controllers/sessionsController.js";

const router = express.Router();

router.post("/iniciar-sesion", iniciarSesion);
router.post("/cerrar-sesion", cerrarSesion);

export default router;

import express from "express";
import {
    solicitarRecuperacion,
    restablecerContrasena
} from "../controllers/authController.js";

const router = express.Router();

router.post("/solicitar-cambio-password", solicitarRecuperacion);
router.post("/resetear-password/:token", restablecerContrasena);

export default router;

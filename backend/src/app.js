import express from "express";
import personRoutes from "./routes/personaRouter.js";
import userRoutes from "./routes/usuarioRouter.js";
import rolOpcionesRoutes from "./routes/rolOpcionesRouter.js";
import rolRoutes from "./routes/rolRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import rolUsuariosRoutes from "./routes/rolUsuariosRouter.js";
import authRoutes from "./routes/authRoutes.js";
import swaggerUI from "swagger-ui-express";
import swaggerDocumentation from "./swagger.json" assert { type: "json" };
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();

console.log("JWT_SECRET desde app.js:", process.env.JWT_SECRET);
console.log("Ruta de ejecución:", process.cwd());


const app = express();
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true
  }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

app.use(express.json());

// Definir prefijos para las rutas
app.use("/persona", personRoutes);
app.use("/usuario", userRoutes);
app.use("/rol-opciones", rolOpcionesRoutes);
app.use("/rol", rolRoutes);
app.use("/session", sessionsRouter);
app.use("/rol-usuarios", rolUsuariosRoutes);
app.use("/auth", authRoutes);

export default app;

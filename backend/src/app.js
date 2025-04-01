import express from "express";
import { swaggerDocs } from './swagger.js';
import personRoutes from "./routes/personaRouter.js";
import userRoutes from "./routes/usuarioRouter.js";
import rolOpcionesRoutes from "./routes/rolOpcionesRouter.js";
import rolRoutes from "./routes/rolRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import rolUsuariosRoutes from "./routes/rolUsuariosRouter.js";


const app = express();

// Definir prefijos para las rutas
app.use("/persona", personRoutes);
app.use("/usuario", userRoutes);
app.use("/rol-opciones", rolOpcionesRoutes);
app.use("/rol", rolRoutes);
app.use("/session", sessionsRouter);
app.use("/rol-usuarios", rolUsuariosRoutes);


// Configurar Swagger
swaggerDocs(app);

export default app;

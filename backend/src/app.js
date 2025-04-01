import express from "express";
import { swaggerDocs } from './swagger.js';
import personRoutes from "./routes/personaRouter.js";
import userRoutes from "./routes/usuarioRouter.js";
import rolOpcionesRoutes from "./routes/rolOpcionesRouter.js";
import rolRoutes from "./routes/rolRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import rolUsuariosRoutes from "./routes/rolUsuariosRouter.js";


const app = express();

app.use(personRoutes);
app.use(userRoutes);
app.use(rolOpcionesRoutes);
app.use(rolRoutes);
app.use(sessionsRouter);
app.use(rolUsuariosRoutes);


// Configurar Swagger
swaggerDocs(app);

export default app;

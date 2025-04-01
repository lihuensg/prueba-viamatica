import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Configuración de las opciones de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de ejemplo',
      version: '1.0.0',
      description: 'Documentación de la API usando Swagger y Express',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a los archivos donde se encuentran los comentarios de Swagger
};

// Generar la especificación de Swagger
const swaggerSpec = swaggerJSDoc(options);

// Middleware para servir la interfaz de Swagger UI
const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export { swaggerDocs, swaggerSpec };

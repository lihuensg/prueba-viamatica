import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger.json";
const endPointFile = ["./app.js"];

const doc = {
  info: {
    title: "API RESTful",
    description: "Documentación de la API RESTful",
  },
  host: "localhost:3000",
  schemes: ["http"],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Indicar que el token es de tipo JWT
      },
    },
  },
  security: [{ BearerAuth: [] }], // Aplica la autenticación por defecto
};

swaggerAutogen()(outputFile, endPointFile, doc);

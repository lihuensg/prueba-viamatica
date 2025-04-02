import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger.json';
const endPointFile = ['./app.js'];

const doc = {
  info: {
    title: 'API RESTful',
    description: 'Documentación de la API RESTful',
  },
  host: 'localhost:3000',
  schemes: ['http'],
}

swaggerAutogen()(outputFile, endPointFile, doc);
import { Sessions } from '../models/Sessions.js';


export const generarCorreo = (nombre, apellido, identificacion) => {
    let correo = `${nombre[0].toLowerCase()}${apellido.toLowerCase()}${identificacion}@mail.com`;
    // Lógica para evitar emails duplicados
    return correo;
  };
  
  export const validarUsername = (nombre, apellido) => {
    return `${nombre[0]}${apellido}`; // Lógica de validación para username
  };
  
  export const validarPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(password);
  };
  
  export const validarIdentificacion = (identificacion) => {
    const identificacionRegex = /^[0-9]{10}$/; // Solo números y exactamente 10 caracteres
    return identificacionRegex.test(identificacion);
  };
  
  export const validarFechaNacimiento = (fechaNacimiento) => {
    const fecha = new Date(fechaNacimiento);
    const fechaActual = new Date();
    
    // Validar que la fecha de nacimiento no sea una fecha futura
    return fecha < fechaActual;
  };

  

  export const verificarSesionActivaMiddleware = async (req, res, next) => {
    const { sessionId } = req.body;
  
    const sessionActiva = await Sessions.findOne({
      where: {
        idSesion: sessionId,
        isDeleted: false,
        FechaCierre: null,
      },
    });
  
    if (!sessionActiva) {
      return res.status(403).json({ error: 'No tienes una sesión activa o la sesión ha expirado.' });
    }
  
    next();
  };
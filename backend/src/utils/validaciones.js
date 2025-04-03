import { Sessions } from "../models/Sessions.js";
import { Usuarios } from "../models/Usuarios.js"; 

export const generarCorreo = async (nombre, apellido, identificacion) => {
  let correoBase = `${nombre[0].toLowerCase()}${apellido.toLowerCase()}${identificacion}@mail.com`;
  let correoUnico = correoBase;
  let contador = 1;

  while (await Usuarios.findOne({ where: { Mail: correoUnico } })) {
    correoUnico = `${correoBase.split("@")[0]}${contador}@mail.com`;
    contador++;
  }

  return correoUnico;
};

export const validarUsername = async (nombre, apellido) => {
  const primeraLetra = nombre[0].toUpperCase();
  const apellidoLimpio = apellido.replace(/\s+/g, "").toLowerCase();
  const numeroAleatorio = Math.floor(Math.random() * 90) + 10;

  let username = `${primeraLetra}${apellidoLimpio}${numeroAleatorio}`;
  username = username.replace(/[^a-zA-Z0-9]/g, ""); 

  if (username.length < 8) {
    username = username.padEnd(8, "x");
  } else if (username.length > 20) {
    username = username.slice(0, 20);
  }

  let usernameUnico = username;
  let contador = 1;
  while (await Usuarios.findOne({ where: { UserName: usernameUnico } })) {
    usernameUnico = `${username}${contador}`;
    contador++;
    if (usernameUnico.length > 20) {
      usernameUnico = usernameUnico.slice(0, 20);
    }
  }

  return usernameUnico;
};

export const validarPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-])[^\s]{8,}$/;
  return regex.test(password);
};


export const validarIdentificacion = (identificacion) => {
  // 1. Validar que sean exactamente 10 dígitos numéricos
  const identificacionRegex = /^[0-9]{10}$/;
  if (!identificacionRegex.test(identificacion)) {
    return false;
  }

  // 2. Validar que no haya cuatro números seguidos repetidos
  const repetidosRegex = /(.)\1{3,}/; // Busca cualquier carácter repetido 4 veces seguidas
  if (repetidosRegex.test(identificacion)) {
    return false;
  }

  return true;
};

export const validarFechaNacimiento = (fechaNacimiento) => {
  const fecha = new Date(fechaNacimiento);
  const fechaActual = new Date();

  // Validar que la fecha de nacimiento no sea una fecha futura
  return fecha < fechaActual;
};

export const verificarSesionActivaMiddleware = async (req, res, next) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Falta sessionId en la petición." });
  }

  console.log("Buscando sesión activa con:", {
    sessionId,
    isDeleted: false,
    FechaCierre: null,
  });

  const sessionActiva = await Sessions.findOne({
    where: {
      id: sessionId, // Corregido: debe coincidir con la BD
      isDeleted: false,
      FechaCierre: null,
    },
  });

  if (!sessionActiva) {
    return res
      .status(403)
      .json({ error: "No tienes una sesión activa o la sesión ha expirado." });
  }

  next();
};

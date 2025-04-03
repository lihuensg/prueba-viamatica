import { Sessions } from "../models/Sessions.js";

export const generarCorreo = (nombre, apellido, identificacion) => {
  let correo = `${nombre[0].toLowerCase()}${apellido.toLowerCase()}${identificacion}@mail.com`;
  // Lógica para evitar emails duplicados
  return correo;
};

export const validarUsername = (nombre, apellido) => {
  // Convertir primera letra del nombre a mayúscula y apellido sin espacios
  const primeraLetra = nombre[0].toUpperCase();
  const apellidoLimpio = apellido.replace(/\s+/g, "").toLowerCase(); // Sin espacios

  // Generar número aleatorio de 2 dígitos para garantizar un número en el username
  const numeroAleatorio = Math.floor(Math.random() * 90) + 10; // Entre 10 y 99

  // Unir las partes
  let username = `${primeraLetra}${apellidoLimpio}${numeroAleatorio}`;

  // Asegurar que tiene entre 8 y 20 caracteres (cortar si es muy largo)
  if (username.length < 8) {
    username = username.padEnd(8, "x"); // Completar con "x" si es muy corto
  } else if (username.length > 20) {
    username = username.slice(0, 20); // Cortar si es muy largo
  }

  return username;
};

export const validarPassword = (password) => {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]).{8,}$/;
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

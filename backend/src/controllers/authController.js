import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { Usuarios } from "../models/Usuarios.js";
import crypto from "crypto";
import { validarPassword } from "../utils/validaciones.js";

export const solicitarRecuperacion = async (req, res) => {
    const { email } = req.body;
  
    try {
      const usuario = await Usuarios.findOne({ where: { Mail: email } });
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const token = crypto.randomBytes(32).toString('hex');
      const expiracion = new Date(Date.now() + 3600000); // 1 hora
  
      usuario.resetToken = token;
      usuario.resetTokenExpiration = expiracion;
      await usuario.save();
  
      const enlace = `http://localhost:3000/reset-password/${token}`;
      console.log(`Enlace de recuperación: ${enlace}`); // simulación
  
      // Aquí podés usar sendMail si querés mandarlo realmente
      // await sendMail(email, "Recuperación de contraseña", `Hacé clic en este enlace: ${enlace}`)
  
      res.status(200).json({ mensaje: 'Enlace de recuperación enviado.' });
  
    } catch (error) {
      console.error("Error en recuperación:", error);
      res.status(500).json({ error: 'Error al solicitar recuperación' });
    }
  };

  export const restablecerContrasena = async (req, res) => {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;
  
    try {
      if (!validarPassword(nuevaContrasena)) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo' });
      }
      
      const usuario = await Usuarios.findOne({
        where: {
          resetToken: token,
          resetTokenExpiration: { [Op.gt]: new Date() }
        }
      });
  
      if (!usuario) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
  
      const hash = await bcrypt.hash(nuevaContrasena, 10);
      usuario.Password = hash;
      usuario.resetToken = null;
      usuario.resetTokenExpiration = null;
      await usuario.save();
  
      res.status(200).json({ mensaje: 'Contraseña actualizada con éxito' });
    } catch (error) {
      console.error("Error al restablecer:", error);
      res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
  };
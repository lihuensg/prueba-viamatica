import app from "./app.js";
import { sequelize } from "./database/database.js";

async function main() {
  try {
      await sequelize.sync({ force: false }); // Usa `force: true` solo si quieres recrear las tablas
      app.listen(3000, () => {
          console.log("Servidor corriendo en el puerto 3000");
      });
      console.log("Base de datos conectada y tablas sincronizadas.");
  } catch (error) {
      console.error("Error al conectar la base de datos:", error);
  }
}

main();

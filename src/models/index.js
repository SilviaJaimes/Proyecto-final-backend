import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

// Importar rutas
import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/users.js";
import tutorRoutes from "./routers/tutores.js";
import tutoriasRoutes from "./routers/tutorias.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tutores", tutorRoutes);
app.use("/api/tutorias", tutoriasRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de Tutorías funcionando correctamente" });
});

// Probar conexión a la base de datos
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de datos conectada correctamente");
    
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
  }
};

testConnection();

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});

export default app;
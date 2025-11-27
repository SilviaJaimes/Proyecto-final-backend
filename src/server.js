import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';

// Import routes
import authRoutes from './routers/auth.js';
import tutoresRoutes from './routers/tutores.js';
import tutoriasRoutes from './routers/tutorias.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutores', tutoresRoutes);
app.use('/api/tutorias', tutoriasRoutes);

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB conectado');
    // En desarrollo: sync para crear tablas según modelos
    // await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Error iniciando servidor:', err);
  }
};

start();
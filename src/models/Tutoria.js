import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Estudiante from './Estudiante.js';
import Tutor from './Tutor.js';
import Horario from './Horario.js';

const Tutoria = sequelize.define('Tutoria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  estudiante_id: { type: DataTypes.INTEGER, allowNull: false },
  tutor_id: { type: DataTypes.INTEGER, allowNull: false },
  horario_id: { type: DataTypes.INTEGER, allowNull: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.TIME, allowNull: false },
  estado: { 
    type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada', 'cancelada', 'finalizada'), 
    defaultValue: 'pendiente' 
  },
  resumen: { type: DataTypes.TEXT }
}, { tableName: 'tutorias', timestamps: false });

Tutoria.belongsTo(Estudiante, { foreignKey: 'estudiante_id', as: 'estudiante' });
Tutoria.belongsTo(Tutor, { foreignKey: 'tutor_id', as: 'tutor' });
Tutoria.belongsTo(Horario, { foreignKey: 'horario_id', as: 'horario' });

export default Tutoria;
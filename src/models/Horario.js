import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Tutor from './Tutor.js';

const Horario = sequelize.define('Horario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tutor_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.TIME, allowNull: false },
  estado: { 
    type: DataTypes.ENUM('disponible', 'ocupado', 'reservado', 'completado', 'cancelado'), 
    defaultValue: 'disponible' 
  }
}, { tableName: 'horarios', timestamps: false });

Horario.belongsTo(Tutor, { foreignKey: 'tutor_id', as: 'tutor' });
Tutor.hasMany(Horario, { foreignKey: 'tutor_id', as: 'horarios' });

export default Horario;
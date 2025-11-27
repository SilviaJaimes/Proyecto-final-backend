import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Estudiante = sequelize.define('Estudiante', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  nivel_academico: { type: DataTypes.STRING },
  intereses: { type: DataTypes.TEXT }
}, { tableName: 'estudiantes', timestamps: false });

Estudiante.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
User.hasOne(Estudiante, { foreignKey: 'usuario_id', as: 'estudianteData' });

export default Estudiante;
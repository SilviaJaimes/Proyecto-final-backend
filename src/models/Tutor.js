import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Tutor = sequelize.define('Tutor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  especialidad: { type: DataTypes.STRING },
  descripcion: { type: DataTypes.TEXT }
}, { tableName: 'tutores', timestamps: false });

Tutor.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
User.hasOne(Tutor, { foreignKey: 'usuario_id', as: 'tutorData' });

export default Tutor;
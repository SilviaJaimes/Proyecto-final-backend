import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('estudiante','tutor'), allowNull: false }
}, { 
  tableName: 'users', 
  timestamps: false 
});

User.findByEmail = async function(correo) {
  return await this.findOne({ where: { correo } });
};

export default User;
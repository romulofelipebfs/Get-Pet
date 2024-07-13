const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');
const User = require('./User');

const Pet = sequelize.define('Pet', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      available: {
        type: DataTypes.BOOLEAN,
        
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
      },
      adopterId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
      },
})

// Definindo relacionamentos
User.hasMany(Pet, { foreignKey: 'userId' });
Pet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Pet, { foreignKey: 'adopterId' });
Pet.belongsTo(User, { foreignKey: 'adopterId', as: 'adopter' });

module.exports = Pet;
'use strict';


const bcrypt = require("bcryptjs");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    async checkPassword(password) {
      return bcrypt.compare(password, this.password); // Use bcrypt's compare method
    }


    static associate(models) {
      // define association here
      
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10); // Use bcrypt to generate salt
        user.password = await bcrypt.hash(user.password, salt); // Use bcrypt to hash the password
      },
    },

  });
  return User;
};
const conn = require("../db/conn");
const { DataTypes } = require("sequelize");

const Conquista = conn.define("Conquista", {
    titulo: {
      type: DataTypes.STRING,
      required: false,
    },
    descricao: {
      type: DataTypes.STRING,
      required: true,
    }
  });
   

module.exports = Conquista;
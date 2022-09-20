const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("netcursos", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

const Usuario = sequelize.define("usuario", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Curso = sequelize.define("curso", {
  titulo: {
    type: DataTypes.STRING,
  },
});

const CursoConcluido = sequelize.define("curso_concluido", {
  cursoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Curso,
      key: "id",
    },
  },
  UsuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: "id",
    },
  },
});

Usuario.belongsToMany(Curso, { through: CursoConcluido });
Curso.belongsToMany(Usuario, { through: CursoConcluido });

module.exports = { Curso, Usuario, CursoConcluido, sequelize };

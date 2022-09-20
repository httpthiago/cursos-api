const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const { Curso, Usuario, sequelize } = require("./model/models");
const { QueryTypes } = require("sequelize");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/cursos/adicionar", (req, res) => {
  Curso.create({
    titulo: req.body.titulo,
  }).then((curso) => {
    res.json({
      message: "Curso enviado com sucesso!",
      cursoEnviado: curso,
    });
  });
});

app.get("/cursos", (req, res) => {
  Curso.findAll({
    attributes: ["id", "titulo"],
  })
    .then((cursos) => {
      res.json(cursos);
    })
    .catch((err) => {
      res.json({ message: `Ocorreu um erro ao consultar cursos: ${err}` });
    });
});

app.delete("/cursos/deletar/:id", (req, res) => {
  Curso.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((curso) => {
      res.json({
        message: "Curso deletado com sucesso!",
      });
    })
    .catch((err) => {
      res.json({ message: `Erro ao excluir curso: ${err}` });
    });
});

app.post("/usuarios/adicionar", (req, res) => {
  Usuario.create({
    nome: req.body.nome,
    cpf: req.body.cpf,
  })
    .then((usuario) => {
      res.json({
        message: "Usuario criado com sucesso!",
      });
    })
    .catch((err) => {
      res.json({
        message: `Ocorreu um erro ao criar usuário ${err}`,
      });
    });
});

app.get("/usuarios", (req, res) => {
  Usuario.findAll({
    attributes: ["id", "nome", "cpf"],
  })
    .then((usuarios) => {
      res.json(usuarios);
    })
    .catch((err) => {
      res.json({ message: `Erro ao consultar usuários ${err}` });
    });
});

app.delete("/usuarios/deletar/:id", (req, res) => {
  Usuario.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((curso) => {
      res.json({
        message: "Usuario deletado com sucesso!",
      });
    })
    .catch((err) => {
      res.json({ message: `Erro ao excluir curso: ${err}` });
    });
});

app.get("/cursos/cursos-concluidos/:cpf", (req, res) => {
  let cpf = req.params.cpf;
  sequelize
    .query(
      `SELECT cur.id, cur.titulo, cc.createdAt FROM cursoconcluido cc 
    INNER JOIN cursos cur ON cur.id= cc.cursoId
    INNER JOIN usuarios usu ON usu.id = cc.usuarioId
    where usu.cpf like :cpf;`,
      {
        replacements: { cpf: `${cpf}` },
        type: QueryTypes.SELECT,
      }
    )
    .then((cursos) => {
      res.json(cursos);
    })
    .catch((err) => {
      res.json({
        message: `Erro ao consultar cursos para o cpf ${cpf}: ${err}`,
      });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});

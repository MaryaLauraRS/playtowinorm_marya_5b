require("dotenv").config();
const conn = require("./db/conn");
const express = require("express");
const exphbs = require("express-handlebars");

const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const Cartao = require("./models/Cartao");
const Conquista = require("./models/Conquistas");

Jogo.belongsToMany(Usuario, { through: "aquisicoes" });
Usuario.belongsToMany(Jogo, { through: "aquisicoes" });

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");


app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json());

app.get("/", (req,res)=>{
 res.render("home");
});

//usuario

app.get("/usuarios", async (req,res)=>{

    const usuarios = await Usuario.findAll({ raw: true });

    res.render("usuarios", {usuarios});
});

app.get("/usuarios/novo", (req,res)=>{
    res.render("formUsuario");
});

app.post("/usuarios/novo", async (req,res)=>{
    const nickname = req.body.nickname;
    const nome = req.body.nome;

    const dadosUsuario = {
        nickname,
        nome,
    };

    const usuario = await Usuario.create(dadosUsuario);

    res.send("Usuário inserido sob o id: " + usuario.id);
});

app.get("/usuarios/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, {
        raw:true
    });
    res.render("formUsuario", {usuario});

        //  const usuario = Usuario.findOne({
        //    where: {id:id},
        //    raw: true
        //});
} );

app.post("/usuarios/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    };

 const retorno = await Usuario.update(dadosUsuario, {where: {id: id }});

    if (retorno > 0){
        res.render("usuarios");
    } else{
        res.send("Erro ao atualizar usuário");
    }
});

app.post("/usuarios/:id/delete", async (req, res) => {
    const id = parseInt(req.params.id);

    const retorno = await Usuario.destroy({where: {id: id }});

    if (retorno > 0){
        res.redirect("/usuarios");
    } else{
        res.send("Erro ao deletar usuário");
    }
});

//jogo

app.get("/jogos", async (req,res)=>{

    const Jogos = await Jogo.findAll({ raw: true });

    res.render("jogos", {Jogos});
});

app.get("/jogos/novo", (req,res)=>{
    res.render("formJogo");
});

app.post("/jogos/novo", async (req,res)=>{
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const precobase = req.body.precobase;

    const dadosJogo = {
        titulo,
        descricao,
        precobase,
    };

    const jogo = await Jogo.create(dadosJogo);

    res.send("Jogo inserido sob o id: " + jogo.id);
});

app.post("/jogos/novo", async (req,res)=>{
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const precobase = req.body.precobase;

    const dadosJogo = {
        titulo,
        descricao,
        precobase,
    };

    const jogo = await Jogo.create(dadosJogo);

    res.send("jogo inserido sob o id: " + jogo.id);
});

app.get("/jogos/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, {
        raw:true
    });
    res.render("formJogo", {jogo});

        //  const usuario = Usuario.findOne({
        //    where: {id:id},
        //    raw: true
        //});
} );

app.post("/jogos/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precobase: req.body.precobase,
    };

 const retorno = await Jogo.update(dadosJogo, {where: {id: id }});

    if (retorno > 0){
        res.render("jogos");
    } else{
        res.send("Erro ao atualizar jogos");
    }
});

app.post("/jogos/:id/delete", async (req, res) => {
    const id = parseInt(req.params.id);

    const retorno = await Jogo.destroy({where: {id: id }});

    if (retorno > 0){
        res.redirect("/jogos");
    } else{
        res.send("Erro ao deletar o jogo");
    }
});

//cartão

app.get("/usuarios/:id/cartoes", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });
  
    const cartoes = await Cartao.findAll({
      raw: true,
      where: { UsuarioId: id },
    });
  
    res.render("cartoes.handlebars", { usuario, cartoes });
  });

  app.get("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });
  
    res.render("formCartao", { usuario });
  });

  app.post("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);
  
    const dadosCartao = {
      numero: req.body.numero,
      nome: req.body.nome,
      codSeguranca: req.body.codSeguranca,
      UsuarioId: id,
    };
  
    await Cartao.create(dadosCartao);
  
    res.redirect(`/usuarios/${id}/cartoes`);
  });

  //conquistas

  app.get("/jogos/:id/conquistas", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });
  
    const conquistas = await Conquista.findAll({
      raw: true,
      where: { JogoId: id },
    });
  
    
    res.render("conquista.handlebars", { jogo, conquistas });
  });

  app.get("/jogos/:id/novoConquista", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });
  
    res.render("formConquista", { jogo });
  });

  app.post("/jogos/:id/novoConquista", async (req, res) => {
    const id = parseInt(req.params.id);
  
    const dadosConquista = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        JogoId: id,
    };
  
    await  Conquista.create(dadosConquista);
  
    res.redirect(`/jogos/${id}/conquistas`);
  });

app.listen(8000);

conn
    .sync({force:true})
    .then( () => {
        console.log("Conectado e sincronizado!");
    }).catch( (err) => {
        console.log("Ocorreu um erro: " + err);
    })

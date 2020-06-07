const express = require("express");
const server = express();

//pegar o banco de dados
const db = require("./database/db");

//configurar pasta publica
server.use(express.static("public"));

//configurar o uso do req.body no nosso app
server.use(express.urlencoded({extended: true}));

// utilizando template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: server,
    noCache: true
});
//configurar caminhos da minha aplicação(página inicial)
//req: require, requisição
//res: response, resposta
server.get("/", (req,res) => {
    return res.render("index.html");
});

server.get("/create-point", (req,res) => {

    // console.log(res.query);

    return res.render("create-point.html");
});

server.post("/savepoint",(req, res) => {

    //Inserir novos pontos
    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
        ) VALUES (?,?,?,?,?,?,?);
    `;
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
        ]; 
    
    function afterInsertData(err){
        if(err){
            console.log(err);
            return res.send("Erro no cadastro!");
        }
        console.log("cadastrado com sucesso");
        console.log(this);
        // return res.send("ok");
        return res.render("create-point.html",{ saved: true })
    }

    db.run(query, values, afterInsertData);

    // console.log(req.body)
})

server.get("/search", (req,res) => {

    const search = req.query.search;

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html",{total: 0});
    }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city Like '%${search}%'`,function(err, rows){
        if(err){
            console.log(err);
        }

        // console.log("Aqui estão os teus registros:");
        // console.log(rows);

        const total = rows.length;

        //mostrar a página html com os dados do banco de dados

        //o total, por ter o mesmo nome da propriedade escolhida para a classe, pode ser passado somente a variavel, sem colocar a propriedade e os dois pontos.
        return res.render("search-results.html",{ places: rows, total: total});
    });
});

//ligar o servidor
server.listen(3000);
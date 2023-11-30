import express from "express";
import {dirname} from "path";
import {fileURLToPath} from "url";
import bodyParser from "body-parser";

let players = [];
let jsonData = [];

const app=express();
const port=3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('frontend'));

const __dirname=dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res)=>{
    players = [];
    res.sendFile(__dirname+"/index.html");
})

app.post("/playerOne", (req, res)=>{
    players = [];
    players.push(req.body.playerOne);
    players.push(req.body.playerTwo);
    res.render("playerOne.ejs", {player: players[0]});
})

app.post("/playerTwo", (req, res)=>{
    res.render("playerTwo.ejs", {player: players[1]});
})

app.post("/getData", (req, res) =>{
    jsonData.push(req.body);
})

app.get('/sendShips', function(req, res){
    console.log(jsonData);
    res.json(jsonData);
});

app.get('/sendPlayers', function(req, res){
    console.log(players);
    res.json(players);
});

app.post("/game", (req, res)=>{
    res.render("game.ejs", {
        playerOne: players[0],
        playerTwo: players[1]
    });
})

app.post("/", (req, res)=>{
    players=[];
    console.log(players);
    res.sendFile(__dirname+"/frontend/index.html");
})

app.listen(port, (err)=>{
    if(err) console.log(err);
    console.log(`Listening on Port ${port}`);
})
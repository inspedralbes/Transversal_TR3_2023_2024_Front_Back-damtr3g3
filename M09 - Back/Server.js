const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require("cors");
const socketIO = require('socket.io');
const http = require('http');
const { spawn } = require('child_process');
var session = require('express-session')
const {getUsuarisLogin, registrarUsuariJoc} = require('../M06 - Acces BD/androidScript.js');
const { v4: uuidv4 } = require('uuid');
const PORT = 3327;
const ubicacioGrafics = path.join(__dirname, "..", "M10/grafics");
const arxiuPython = path.join(__dirname, "..", "M10/graficos.py");
const connection = mysql.createPool({
  host: "dam.inspedralbes.cat",
  user: "a22jonmarqui_grup3",
  password: "Pedralbes24",
  database: "a22jonmarqui_grup3"
});
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);
  }
}));

app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post("/usuarisLogin", function (req, res) {
    const user = req.body;
    let usuariTrobat = false;
  
    autoritzacio = { "autoritzacio": false };
  
    usuaris = getUsuarisLogin(connection).then((usuaris) => {
        usuaris = JSON.parse(usuaris)
        console.log(usuaris)
        for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {
  
            if (usuaris[i].nomCognoms == user.nomCognoms) {
                contra = (user.contrasenya)
                if (usuaris[i].contrasenya == contra) {
                    usuariTrobat = true;
                    req.session.nombre = user.nomCognoms;
                    usuariLog = req.session.nombre
                }
            }
        }
        autoritzacio.autoritzacio = usuariTrobat;
        res.json(autoritzacio)
    })
  })
  
  app.post("/registrarUsuari", function (req, res) {
    nouUsuari = {
        "nomCognoms": req.body.nomCognoms,
        "correu": req.body.correu,
        "contrasenya": req.body.contrasenya,  
    }
    autoritzacio = { "autoritzacio": false };
    auto = registrarUsuariJoc(connection, nouUsuari).then((auto) => {
        autoritzacio.autoritzacio = auto
        if (autoritzacio.autoritzacio) {
            req.session.nombre = req.body.nomCognoms;
            usuariLog = req.session.nombre
        }
        res.json(autoritzacio)
    })
  })
  




















httpServer.listen(PORT, () => {
    console.log("Server => " + PORT);
  });
var history = require('connect-history-api-fallback')
const staticFileMiddleware = express.static('../dist');
app.use(staticFileMiddleware);
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(staticFileMiddleware);
  
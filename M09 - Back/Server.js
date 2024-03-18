const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
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
const {crearSala, unirSala, getInfoSalaConcreta} = require('../M06 - Acces BD/mongo(Android).js');
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

app.post("/usuarisLogin", async function (req, res) {
  const user = req.body;
  let usuariTrobat = false;

  autoritzacio = { "autoritzacio": false };

  usuaris = await getUsuarisLogin(connection);
  usuaris = JSON.parse(usuaris)
  console.log(usuaris)
  for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {
      if (usuaris[i].correu == user.correu) { 
          const match = await bcrypt.compare(user.contrasenya, usuaris[i].contrasenya);
          if (match) {
              usuariTrobat = true;
              req.session.nombre = user.correu; 
              usuariLog = req.session.nombre
          }
      }
  }
  autoritzacio.autoritzacio = usuariTrobat;
  res.json(autoritzacio)
})

app.post("/registrarUsuari", async function (req, res) {
  nouUsuari = {
      "nomCognoms": req.body.nomCognoms,
      "correu": req.body.correu,
      "contrasenya": req.body.contrasenya,  
  }
  autoritzacio = { "autoritzacio": false };
  auto = await registrarUsuariJoc(connection, nouUsuari);
  autoritzacio.autoritzacio = auto
  if (autoritzacio.autoritzacio) {
      req.session.nombre = req.body.correu;
      usuariLog = req.session.nombre
  }
  res.json(autoritzacio)
})


//Creacio sales Joc

// Manejar la solicitud POST para crear una sala
app.post("/crearSala", async function (req, res) {  
  try {
      const salaData = {
          idSala: req.body.idSala, 
          creador: req.body.creadorSala,
          estat: req.body.estatSala,
          jugadores: req.body.jugadores,
      };

      
      await crearSala(salaData);
      res.status(200).send("Sala creada correctamente");
  } catch (error) {
      console.error("Error al crear la sala:", error);
      res.status(500).send("Error al crear la sala");
  }
});

// Manejar la solicitud POST para unirse a una sala
app.post("/unirSala", async function (req, res) {
  try {
      const salaData = {
          idSala: req.body.idSala, 
          nomUsuari: req.body.nomUsuari
      };
      await unirSala(salaData);
      res.status(200).send("Te has unido a la sala correctamente");
  } catch (error) {
      console.error("Error al unirse a la sala:", error);
      res.status(500).send("Error al unirse a la sala");
  }
});


//Sockets

io.on('connection', (socket) => {
  console.log('Usuari Connectat');

  socket.on('disconnect', () => {
      console.log('Usuari Desconnectat');
  });
  
  socket.on('unirSala', async (idSala) => {
    console.log('UnirSala emit rebut', idSala);
    try {
      const salaInfo = await getInfoSalaConcreta(idSala);
      console.log('SalaInfo:', salaInfo); 
      io.emit('actualitzarSala', salaInfo);
      
    } catch (error) {
      console.error("Error al obtener la información de la sala:", error);
    }
  });

});














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
  
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require("cors");
const socketIO = require('socket.io');
const http = require('http');
const { spawn } = require('child_process');
var session = require('express-session')
const xmlrpc = require('xmlrpc');
const {getUsuarisLogin, registrarUsuariJoc, updateScore} = require('../M06 - Acces BD/androidScript.js');
const {crearSala, unirSala, getInfoSalaConcreta} = require('../M06 - Acces BD/mongo(Android).js');
const socketHandler = require('./socketHandler.js');
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



//--------------------Nuxt--------------------


app.get('/api/products', async (req, res) => {
  const common = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/common');
  common.methodCall('authenticate', ['grup3', 'a22jonmarqui@inspedralbes.cat', 'Pedralbes24-', {}], function (error, uid) {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred during authentication' });
    } else {
      const models = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/object');
      models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'product.product', 'search_read', [[]]], function (error, products) {
        if (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'An error occurred' });
        } else {
          // Convierte las imágenes a URLs de datos
          products.forEach(product => {
            if (product.image_1920) {
              product.image_1920 = `data:image/png;base64,${product.image_1920}`;
            }
          });
          res.json(products);
        }
      });
    }
  });
});
app.post('/api/products', async (req, res) => {
  const common = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/common');
  common.methodCall('authenticate', ['grup3', 'a22jonmarqui@inspedralbes.cat', 'Pedralbes24-', {}], function (error, uid) {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred during authentication' });
    } else {
      const models = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/object');

      // Extrae la imagen codificada en base64 de la solicitud
      const base64Image = req.body.image_1920.split(';base64,').pop();

      models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'product.product', 'create', [{
        'name': req.body.name,
        'list_price': req.body.list_price,
        'standard_price': req.body.standard_price,
        'type': req.body.type,
        'image_1920': base64Image,  // Usa la imagen codificada en base64
      }]], function (error, product_id) {
        if (error) {
          console.error('Error:', error);
          res.status(500).json({ success: false, message: 'An error occurred' });
    } else {
      res.json({ success: true, message: 'Product created successfully!', product_id: product_id });
        }
      });
    }
  });
});
app.delete('/api/products/:id', async (req, res) => {
  const common = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/common');
  common.methodCall('authenticate', ['grup3', 'a22jonmarqui@inspedralbes.cat', 'Pedralbes24-', {}], function (error, uid) {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred during authentication' });
    } else {
      const models = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/object');
            // Imprime el ID del producto en la consola
            console.log(`Deleting product with ID: ${req.params.id}`);
      models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'product.product', 'unlink', [[req.params.id]]], function (error, success) {
        if (error) {
          console.error('Error:', error);
          res.status(500).json({ success: false, message: 'An error occurred' });
        } else {
          // Agrega una declaración de registro para la función unlink
          console.log(`Unlink function returned: ${success}`);
          res.json({ success: true, message: 'Product deleted successfully!' });
        }
      });
    }
  });
});


app.post('/sendBroadcast', (req, res) => {
  // Usa el título y el mensaje de la solicitud POST
  const { title, message } = req.body;
  io.emit('broadcast', { title, message });

  // Imprime un mensaje más descriptivo
  console.log(`Emitted broadcast message:\nTitle: ${title}\nMessage: ${message}`); 

  res.send('Successfully sent message');
});


//----------------Log IN i Registre---------------- 

app.post("/usuarisLogin", async function (req, res) {
  const user = req.body;
  let usuariTrobat = false;

  autoritzacio = { "autoritzacio": false };

  usuaris = await getUsuarisLogin(connection);
  usuaris = JSON.parse(usuaris)
  console.log(usuaris)
  for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {
      if (usuaris[i].nomUsuari == user.nomUsuari) { 
          const match = await bcrypt.compare(user.contrasenya, usuaris[i].contrasenya);
          if (match) {
              usuariTrobat = true;
              req.session.nombre = user.nomUsuari; 
              usuariLog = req.session.nombre
          }
      }
  }
  autoritzacio.autoritzacio = usuariTrobat;
  res.json(autoritzacio)
})

app.post("/registrarUsuari", async function (req, res) {
  nouUsuari = {
      "nomUsuari": req.body.nomUsuari,
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

//Jugador puntuar
app.post("/score", async function (req, res) {
  try{
    const score = req.body.score;
    const nomUsuari = req.body.username;
    await updateScore(connection, score, nomUsuari);
    res.status(200).send("Puntuación actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la puntuación:", error);
    res.status(500).send("Error al actualizar la puntuación");
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

  socket.on('join room', (idSala) => {
    socket.join(idSala);
    console.log("Llista d'usuaris a la sala", io.sockets.adapter.rooms.get(idSala));
  });

  socketHandler.startGame(socket, io);
  socketHandler.listenKeyDown(socket, io);
  socketHandler.listenKeyUp(socket, io);
  socketHandler.checkPositions(socket, io);

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

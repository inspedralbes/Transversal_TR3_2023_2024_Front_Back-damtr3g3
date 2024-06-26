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
const { getUsuarisLogin, registrarUsuariJoc, updateScore, getInventariUsuari, afegirInventari, getOnlyProductsUsuari, 
  getUserMoney, restarDiners } = require('../M06 - Acces BD/androidScript.js');
const { crearSala, unirSala, getInfoSalaConcreta, addWinToPlayer } = require('../M06 - Acces BD/mongo(Android).js');
const {actualitzarRanking, obtenerRankingOrdenat} = require('../M06 - Acces BD/mongoRanking.js');
const stats_mongo = require('../M06 - Acces BD/mongoStats.js');
const {actualizarDatos, leerDatos}  = require('../M06 - Acces BD/mongoSettings.js');
const {  saveImageToDB} = require('../M06 - Acces BD/mongoImage.js');

const socketHandler = require('./socketHandler.js');
const { v4: uuidv4 } = require('uuid');
const { Client } = require('ssh2');
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
      models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'product.product', 'search_read', [[], ['name', 'list_price', 'standard_price', 'type', 'image_1920', 'default_code']]], function (error, products) {
        if (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'An error occurred' });
        } else {
          // Convierte las imágenes a URLs de datos y obtén la cantidad de pedidos para cada producto
          const promises = products.map(product => {
            return new Promise((resolve, reject) => {
              if (product.image_1920) {
                product.image_1920 = `data:image/png;base64,${product.image_1920}`;
              }
              models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'sale.order.line', 'search_count', [[['product_id', '=', product.id]]]], function (error, orderCount) {
                if (error) {
                  console.error('Error:', error);
                  reject(error);
                } else {
                  product.orderCount = orderCount;
                  console.log(product.default_code);
                  product.id = product.default_code[0];
                  resolve();
                }
              });
            });
          });
          Promise.all(promises)
            .then(() => res.json(products))
            .catch(error => res.status(500).json({ message: 'An error occurred' }));
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
        'default_code': req.body.default_code,  // Usa la referencia interna
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

app.post('/api/images', async (req, res) => {
  // Extrae la imagen codificada en base64 y el ID del producto de la solicitud
  const base64Image = req.body.image;
  const productId = req.body.productId;

  // Usa la función saveImageToDB para guardar la imagen y el ID del producto en MongoDB
  const imageId = await saveImageToDB(base64Image, productId);

  if (imageId) {
    res.json({ success: true, message: 'Image saved successfully!', imageId: imageId });
  } else {
    res.status(500).json({ success: false, message: 'An error occurred while saving the image.' });
  }
});

app.delete('/api/products/:default_code', async (req, res) => {
  const common = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/common');
  common.methodCall('authenticate', ['grup3', 'a22jonmarqui@inspedralbes.cat', 'Pedralbes24-', {}], function (error, uid) {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred during authentication' });
    } else {
      const models = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/object');
      console.log(`Deleting product with default code: ${req.params.default_code}`);
      models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'product.product', 'search', [[['default_code', '=', req.params.default_code]]]], function (error, productIds) {
        if (error) {
          console.error('Error:', error);
          res.status(500).json({ success: false, message: 'An error occurred' });
        } else {
          if (productIds.length > 0) {
            models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'product.product', 'unlink', [productIds]], function (error, success) {
              if (error) {
                console.error('Error:', error);
                res.status(500).json({ success: false, message: 'An error occurred' });
              } else {
                console.log(`Unlink function returned: ${success}`);
                res.json({ success: true, message: 'Product deleted successfully!' });
              }
            });
          } else {
            res.status(404).json({ success: false, message: 'Product not found' });
          }
        }
      });
    }
  });
});


app.get('/api/userProducts', async (req, res) => {
  const username = req.query.username;

  let inventariUsuari = await getOnlyProductsUsuari(connection, username);
  console.log(inventariUsuari);
  res.json(inventariUsuari);
});

app.get("/api/getUserMoney", async function (req, res) {
  const username = req.query.username;
  const money = await getUserMoney(connection, username);
  res.json(money);
});

app.post('/api/stop', (req, res) => {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('cd /home/ubuntu/dockers; sudo docker-compose stop', (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
        res.send('Shutting down container');
      }).on('data', (data) => {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: '141.147.8.58',
    port: 22,
    username: 'ubuntu',
    privateKey: require('fs').readFileSync('./ssh-key-2024-03-15.key')
  });
});
app.post('/api/start', (req, res) => {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('cd /home/ubuntu/dockers; sudo docker-compose start', (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
        res.send('Starting container');
      }).on('data', (data) => {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: '141.147.8.58',
    port: 22,
    username: 'ubuntu',
    privateKey: require('fs').readFileSync('./ssh-key-2024-03-15.key')
  });
});
app.get('/api/status', (req, res) => {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('cd /home/ubuntu/dockers; sudo docker-compose ps', (err, stream) => {
      if (err) throw err;
      let data = '';
      stream.on('close', (code, signal) => {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
        // Aquí puedes parsear los datos para obtener el estado del contenedor
        res.send(data);
      }).on('data', (chunk) => {
        console.log('STDOUT: ' + chunk);
        data += chunk;
      }).stderr.on('data', (chunk) => {
        console.log('STDERR: ' + chunk);
      });
    });
  }).connect({
    host: '141.147.8.58',
    port: 22,
    username: 'ubuntu',
    privateKey: require('fs').readFileSync('./ssh-key-2024-03-15.key')
  });
});

app.post('/api/buy', async (req, res) => {
  console.log('Request Body:', req.body);
  const common = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/common');
  common.methodCall('authenticate', ['grup3', 'a22jonmarqui@inspedralbes.cat', 'Pedralbes24-', {}], function (error, uid) {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred during authentication' });
    } else {
      const args = [
        req.body.id,
        req.body.name,
        req.body.list_price,
      ]
        restarDiners(connection, req.body.name, req.body.list_price);
        afegirInventari(connection, req.body.name, req.body.id);
        const python = spawn('py', ['./odoo_sale_order.py', ...args]);

        python.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
      
        python.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
      
        python.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          res.send('Successfully executed Python script');
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
app.put('/api/resultados/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const nuevosDatos = req.body;
    const result = await actualizarDatos(id, nuevosDatos);
    res.json({ success: true, message: 'Datos actualizados con éxito', result });
  } catch (error) {
    console.error('Hubo un error al actualizar los datos:', error);
    res.status(500).json({ success: false, message: 'Hubo un error al actualizar los datos' });
  }
});


//----------------Log IN i Registre---------------- 

app.post("/usuarisLogin", async function (req, res) {
  const user = req.body;
  let usuariTrobat = false;

  autoritzacio = { "autoritzacio": false };

  usuaris = await getUsuarisLogin(connection);
  usuaris = JSON.parse(usuaris)
  //console.log(usuaris)
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
    usuariLog = req.session.nombre;
    // Llama a la función para crear clientes en Odoo después de registrar un usuario
    await crearClientesEnOdooDesdeBD();
  }
  res.json(autoritzacio);
});


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
      nomUsuari: req.body.nomUsuari,
      skin: req.body.skin
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
  try {
    const score = req.body.score;
    const nomUsuari = req.body.username;
    const lobbyId = req.body.lobbyId;
    await updateScore(connection, score, nomUsuari);
    await addWinToPlayer(lobbyId, nomUsuari);
    res.status(200).send("Puntuación actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la puntuación:", error);
    res.status(500).send("Error al actualizar la puntuación");
  }
});

app.post("/stats" , async function (req, res) {
  const data = req.body;
  try {
    await stats_mongo.insertStats(data);
    res.status(200).send("Estadísticas insertadas correctamente");
  } catch (error) {
    console.error("Error al insertar las estadísticas:", error);
    res.status(500).send("Error al insertar las estadísticas");
  }
});

app.post("/getInfoSala", async function (req, res) {
  try {
    const salaInfo = await getInfoSalaConcreta(req.body.idSala);
    res.send(salaInfo);
  } catch (error) {
    console.error("Error al obtener la información de la sala:", error);
    res.status(500).send("Error al obtener la información de la sala");
  }
});

app.post('/getInventari', async function (req, res) {

  try {
    let nomUsuari = req.body.nomUsuari;
    console.log(nomUsuari);

    let inventario = await getInventariUsuari(connection, nomUsuari);
    console.log(inventario);
    if (inventario) {
      res.send(inventario);
    }
  } catch (error) {
    res.status(404).send({ message: 'Usuario no encontrado' });
  }
});

app.get('/getStats', async function (req, res) {
  try {
    const stats = await stats_mongo.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Error al obtener las estadísticas:", error);
    res.status(500).json({ message: 'Error getting stats!' });
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

  socket.on('reqRanking', async () => {
    console.log('reqRanking emit rebut');
    try {
      const Ranking = await obtenerRankingOrdenat();
      console.log('Ranking:', Ranking);
      socket.emit('actualitzarRanking', Ranking);

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
  socketHandler.checkHitByLog(socket, io);
  socketHandler.checkHitByPlayer(socket, io);
  socketHandler.checkPlayerDead(socket, io);
  socketHandler.playAgain(socket, io);
  socketHandler.checkGameEnded(socket, io);

});


// Función para crear un cliente en Odoo
async function crearClienteEnOdoo(usuario) {
  return new Promise((resolve, reject) => {
    const common = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/common');
    common.methodCall('authenticate', ['grup3', 'a22jonmarqui@inspedralbes.cat', 'Pedralbes24-', {}], function (error, uid) {
      if (error) {
        console.error('Error during authentication:', error);
        reject(error);
      } else {
        const models = xmlrpc.createClient('http://141.147.8.58:8069/xmlrpc/2/object');
        const base64Image = ''; // Aquí puedes poner la lógica para obtener la imagen codificada en base64

        // Verifica si el cliente ya existe en Odoo antes de crearlo
        models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'res.partner', 'search', [[['name', '=', usuario.nombre]]]], function (error, existentes) {
          if (error) {
            console.error('Error searching for existing client:', error);
            reject(error);
          } else if (existentes.length > 0) {
            // console.log(`Cliente ${usuario.nombre} ya existe en Odoo.`);
            resolve(existentes[0]); // Devuelve el ID del cliente existente
          } else {
            // El cliente no existe, procede a crearlo
            models.methodCall('execute_kw', ['grup3', uid, 'Pedralbes24-', 'res.partner', 'create', [{
              'name': usuario.nombre,
              'email': usuario.correo, // Agrega el correo electrónico como información adicional del cliente
              // Otros campos del cliente, si es necesario
            }]], function (error, partner_id) {
              if (error) {
                console.error('Error creating client:', error);
                reject(error);
              } else {
                resolve(partner_id);
              }
            });
          }
        });
      }
    });
  });
}


// Función para obtener usuarios de la base de datos
async function obtenerUsuariosDeBD() {
  // Aquí debes agregar lógica para obtener los usuarios de tu base de datos
  // Por ejemplo, una consulta a tu base de datos MySQL

  // Ejemplo de consulta a MySQL usando la conexión `connection`
  const [rows, fields] = await connection.execute('SELECT nomUsuari, correu FROM Usuaris');
  return rows.map(row => ({ nombre: row.nomUsuari, correo: row.correu }));
}

// Función principal para crear clientes en Odoo desde usuarios en la base de datos
async function crearClientesEnOdooDesdeBD() {
  try {
    // Obtener usuarios de la base de datos
    const usuarios = await obtenerUsuariosDeBD();

    // Crear un cliente en Odoo para cada usuario
    for (const usuario of usuarios) {
      await crearClienteEnOdoo(usuario);
    }

    console.log('Proceso completado. Todos los clientes creados correctamente.');
  } catch (error) {
    console.error('Error al crear clientes en Odoo desde la base de datos:', error);
  }
}

// Llama a la función principal para iniciar el proceso de creación de clientes en Odoo desde la base de datos
crearClientesEnOdooDesdeBD();

// Recoge el username y elapsedTime del juego y se lo pasa al mongo(Android).js

app.use(express.json()); // Asegúrate de que estás usando el middleware para parsear el cuerpo JSON

app.post("/cronometreYuser", async function (req, res) {
  const elapsedTime = req.body.elapsedTime;
  const username = req.body.username;

  console.log(`Elapsed time received: ${elapsedTime}`);
  console.log(`Username received: ${username}`);

  const rankingData = {
    username: username,
    elapsedTime: elapsedTime
  };

  try {
    const result = await actualitzarRanking(rankingData);
    console.log(`Ranking updated: ${result}`);
  } catch (error) {
    console.error(`Error updating ranking: ${error}`);
  }

  res.json({ success: true, message: 'Elapsed time and username received successfully!' });
});

//Recoge del mongo(Android).js el ranking ordenado y se lo pasa al juego
app.get("/ranking", async function (req, res) {
  try {
    const ranking = await obtenerRankingOrdenat();
    console.log(JSON.stringify(ranking, null, 2)); // Imprime el ranking en la consola del servidor
    res.json(ranking);
  } catch (error) {
    console.error(`Error getting ranking: ${error}`);
    res.status(500).json({ success: false, message: 'Error getting ranking!' });
  }
});
app.post('/ruta/datos', async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { aceleracionTronco, danoPersonaje, velocidadPersonaje } = req.body;

    // Llamas a la función para actualizar los datos en MongoDB
    const result = await actualizarDatos({
      aceleracionTronco,
      danoPersonaje,
      velocidadPersonaje
    });

    // Envías una respuesta al cliente indicando que los datos se han actualizado correctamente
    res.status(200).json({ message: 'Datos actualizados correctamente', result });
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la actualización de datos
    console.error('Error al actualizar los datos en MongoDB:', error);
    // Envía una respuesta de error al cliente
    res.status(500).json({ error: 'Error al actualizar los datos en MongoDB' });
  }
});

app.get('/ruta/datos', async (req, res) => {
  try {
    // Leer los datos de MongoDB
    const datos = await leerDatos();

    // Devolver los datos al cliente
    res.status(200).json(datos);
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante la recuperación de datos
    console.error('Error al recuperar los datos de MongoDB:', error);
    // Enviar una respuesta de error al cliente
    res.status(500).json({ error: 'Error al recuperar los datos de MongoDB' });
  }
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
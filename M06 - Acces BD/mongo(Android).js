module.exports = {crearSala, unirSala, getInfoSalaConcreta};

const { MongoClient } = require('mongodb');
const uri = "mongodb://admin:Pedralbes24@ac-tfqzwz8-shard-00-00.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-01.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-02.uzqtbce.mongodb.net:27017/?ssl=true&replicaSet=atlas-2n9o7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=AtlasCluster";
const client = new MongoClient(uri);

// Función para crear una sala
async function crearSala(salaData) {
    try {
        // Conectar a MongoDB
        await client.connect();

        const result = await client.db("grup3").collection("sala").insertOne(salaData);
        console.log("Sala creada:", result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error("Error al crear la sala:", error);
        throw error;
    } finally {
        // Cerrar la conexión después de realizar la operación
        await client.close();
    }
}

// Función para unir a un usuario a una sala
async function unirSala(salaData) {
    try {
        // Conectar a MongoDB
        await client.connect();

        const idSala = salaData.idSala;
        const nomUsuari = salaData.nomUsuari; 

        // Comprobar si la sala existe
        const sala = await client.db("grup3").collection("sala").findOne({ idSala: idSala });

        if (!sala) {
            console.log(`La sala ${idSala} no existe`);
            throw new Error("La sala no existe");
        }

        console.log(`Uniendo usuario ${nomUsuari} a la sala ${idSala}`);

        // Realizar la actualización en la base de datos para agregar el usuario a la sala
        const result = await client.db("grup3").collection("sala").updateOne(
            { idSala: idSala },
            { $addToSet: { jugadores: nomUsuari } }
        );

        if (result.modifiedCount === 1) {
            console.log(`Usuario ${nomUsuari} se ha unido a la sala ${idSala}`);
        } else {
            console.log(`No se encontró la sala ${idSala} o el usuario ${nomUsuari} ya está en la sala`);
            throw new Error("No se pudo unir a la sala");
        }
    } catch (error) {
        console.error("Error al unirse a la sala:", error);
        throw error;
    } finally {
        // Cerrar la conexión después de realizar la operación
        await client.close();
    }
}


async function getInfoSalaConcreta(idSala) {
    try {
        // Conectar a MongoDB
        await client.connect();

        const result = await client.db("grup3").collection("sala").findOne({ idSala: idSala });
        return result;
    } catch (error) {
        console.error("Error al obtener la sala:", error);
        throw error;
    } finally {
        // Cerrar la conexión después de realizar la operación
        await client.close();
    }
}
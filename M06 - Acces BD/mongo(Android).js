module.exports = {crearSala, unirSala, getInfoSalaConcreta, actualitzarRanking, obtenerRankingOrdenat, addWinToPlayer};

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
        const skin = salaData.skin;

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
            { $addToSet: { jugadores: { wins: 0, nom: nomUsuari, skin: skin } } }
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
    }
}

async function addWinToPlayer(idSala, nomUsuari) {
    try {
        // Conectar a MongoDB
        await client.connect();

        // Incrementar el número de victorias del jugador en la sala
        const result = await client.db("grup3").collection("sala").updateOne(
            { idSala: idSala, "jugadores.nom": nomUsuari },
            { $inc: { "jugadores.$.wins": 1 } }
        );

        if (result.modifiedCount === 1) {
            console.log(`Se ha añadido una victoria al jugador ${nomUsuari} en la sala ${idSala}`);
        } else {
            console.log(`No se encontró la sala ${idSala} o el jugador ${nomUsuari}`);
            throw new Error("No se pudo añadir la victoria al jugador");
        }
    } catch (error) {
        console.error("Error al añadir victoria al jugador:", error);
        throw error;
    }

}

async function actualitzarRanking(rankingData) {
    try {
        // Conectar a MongoDB
        await client.connect();

        // Buscar el documento existente con el mismo username
        const existingDoc = await client.db("grup3").collection("ranking").findOne({ username: rankingData.username });

        let result;
        if (existingDoc) {
            // Si el documento existe y el nuevo elapsedTime es mayor, actualizar el documento
            if (existingDoc.elapsedTime < rankingData.elapsedTime) {
                result = await client.db("grup3").collection("ranking").updateOne(
                    { username: rankingData.username },
                    { $set: { elapsedTime: rankingData.elapsedTime } }
                );
                console.log("Ranking actualitzat:", result.upsertedId || existingDoc._id);
            } else {
                console.log("El elapsedTime existente es mayor. No se actualiza el ranking.");
            }
        } else {
            // Si el documento no existe, insertar el nuevo documento
            result = await client.db("grup3").collection("ranking").insertOne(rankingData);
            console.log("Ranking actualitzat:", result.insertedId);
        }

        return result ? (result.upsertedId || result.insertedId) : existingDoc._id;
    } catch (error) {
        console.error("Error al actualitzar el ranking:", error);
        throw error;
    } finally {
        // Cerrar la conexión después de realizar la operación
        await client.close();
    }
}
async function obtenerRankingOrdenat() {
    try {
        // Conectar a MongoDB
        await client.connect();

        // Obtener todos los documentos de la colección 'ranking', ordenados por 'elapsedTime' de mayor a menor
        const cursor = client.db("grup3").collection("ranking").find().sort({ elapsedTime: -1 });

        const results = await cursor.toArray();
        return results;
    } catch (error) {
        console.error("Error al obtener el ranking:", error);
        throw error;
    } finally {
        // Cerrar la conexión después de realizar la operación
        await client.close();
    }
}

module.exports = {actualitzarRanking, obtenerRankingOrdenat};

const { MongoClient } = require('mongodb');
const uri = "mongodb://admin:Pedralbes24@ac-tfqzwz8-shard-00-00.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-01.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-02.uzqtbce.mongodb.net:27017/?ssl=true&replicaSet=atlas-2n9o7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=AtlasCluster";
const client = new MongoClient(uri);

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
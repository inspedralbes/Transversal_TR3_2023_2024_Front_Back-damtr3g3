module.exports = {insertStats};

const { MongoClient } = require('mongodb');
const uri = "mongodb://admin:Pedralbes24@ac-tfqzwz8-shard-00-00.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-01.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-02.uzqtbce.mongodb.net:27017/?ssl=true&replicaSet=atlas-2n9o7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=AtlasCluster";
const client = new MongoClient(uri);

async function insertStats(data){
    try {
        await client.connect();
        const result = await client.db("grup3").collection("stats").insertOne(data);
        console.log("Stats inserted:", result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error("Error al insertar las estadísticas:", error);
        throw error;
    } finally {
        await client.close();
    }
}
module.exports = { actualizarDatos, leerDatos };

const { MongoClient } = require('mongodb');
const uri = "mongodb://admin:Pedralbes24@ac-tfqzwz8-shard-00-00.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-01.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-02.uzqtbce.mongodb.net:27017/?ssl=true&replicaSet=atlas-2n9o7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=AtlasCluster";
const client = new MongoClient(uri);

async function actualizarDatos(nuevosDatos) {
    try {
        await client.connect();
        const result = await client.db("grup3").collection("resultados").updateOne(
            { _id: "datosUnicos" },
            { $set: nuevosDatos },
            { upsert: true }
        );
        console.log("Datos actualizados con éxito:", result.upsertedId || result.insertedId);
        return result.upsertedId || result.insertedId;
    } catch (error) {
        console.error("Error al actualizar los datos:", error);
        throw error;
    } finally {
        await client.close();
    }
}
async function leerDatos() {
    try {
        await client.connect();
        const datos = await client.db("grup3").collection("resultados").findOne({ _id: "datosUnicos" });
        console.log("Datos leídos con éxito:", datos);
        return datos;
    } catch (error) {
        console.error("Error al leer los datos:", error);
        throw error;
    } finally {
        await client.close();
    }
}


module.exports = {crearSala, unirSala};

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:Pedralbes24@atlascluster.uzqtbce.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";
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

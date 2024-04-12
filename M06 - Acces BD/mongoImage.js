module.exports = {saveImageToDB};

const { MongoClient } = require('mongodb');
const uri = "mongodb://admin:Pedralbes24@ac-tfqzwz8-shard-00-00.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-01.uzqtbce.mongodb.net:27017,ac-tfqzwz8-shard-00-02.uzqtbce.mongodb.net:27017/?ssl=true&replicaSet=atlas-2n9o7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=AtlasCluster";
const client = new MongoClient(uri);

async function saveImageToDB(base64Image, productId) {
  try {
    await client.connect();
    const collection = client.db("grup3").collection("images");  // Usa tu base de datos y colección
    const result = await collection.insertOne({ image: base64Image, productId: productId });
    console.log(`Image saved with id: ${result.insertedId}`);
    return result.insertedId;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

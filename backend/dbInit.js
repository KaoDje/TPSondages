const { MongoClient } = require("mongodb");

const URI = "mongodb://127.0.0.1:27017/";
const dbName = "SondageDB";

const connectDB = async () => {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log("Connecté à MongoDB");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

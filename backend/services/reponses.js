const { MongoClient, ObjectId } = require("mongodb");

const URI = "mongodb://127.0.0.1:27017/";
const dbName = "SondageDB";
const client = new MongoClient(URI);
let reponsesDb;

const connectDB = async () => {
  await client.connect();
  const db = client.db(dbName);
  reponsesDb = db.collection("reponses");
};

exports.addReponses = async (userId, sondageId, reponses) => {
  await connectDB();
  reponses.forEach((reponse) => {
    reponse.question_id = new ObjectId(reponse.question_id);
  });
  return await reponsesDb.insertOne({
    sondage_id: new ObjectId(sondageId),
    utilisateur_id: new ObjectId(userId),
    reponses: reponses,
  });
};

exports.getAllReponses = async (id) => {
  await connectDB();
  return {
    reponses: await reponsesDb.find({ sondage_id: new ObjectId(id) }).toArray(),
  };
};

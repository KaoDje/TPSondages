const { MongoClient, ObjectId } = require("mongodb");

const URI = "mongodb://127.0.0.1:27017/";
const dbName = "SondageDB";
const client = new MongoClient(URI);
let sondages;

const connectDB = async () => {
  await client.connect();
  const db = client.db(dbName);
  sondages = db.collection("sondages");
};

exports.getAllSondages = async () => {
  await connectDB();
  return await sondages.find({}).toArray();
};

exports.getSondage = async (id) => {
  await connectDB();
  const sondage = await sondages.findOne({ _id: new ObjectId(id) });
  return { sondage: sondage };
};

exports.createSondage = async (sondage) => {
  await connectDB();
  sondage._id = new ObjectId();
  if (sondage.questions) {
    sondage.questions.forEach((question) => {
      question._id = new ObjectId();
    });
  }
  return await sondages.insertOne(sondage);
};

exports.updateSondageName = async (id, name) => {
  await connectDB();
  return await sondages.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: { nom: name },
    }
  );
};

exports.updateQuestion = async (sondageId, questionId, question) => {
  await connectDB();
  if (question.reponses) {
    return await sondages.updateOne(
      {
        _id: new ObjectId(sondageId),
        "questions._id": new ObjectId(questionId),
      },
      {
        $set: {
          "questions.$.intitule": question.intitule,
          "questions.$.type": question.type,
          "questions.$.reponses": question.reponses,
        },
      }
    );
  } else {
    return await sondages.updateOne(
      {
        _id: new ObjectId(sondageId),
        "questions._id": new ObjectId(questionId),
      },
      {
        $set: {
          "questions.$.intitule": question.intitule,
          "questions.$.type": question.type,
        },
        $unset: { "questions.$.reponses": "" },
      }
    );
  }
};

exports.deleteSondage = async (id) => {
  await connectDB();
  return await sondages.deleteOne({ _id: new ObjectId(id) });
};

exports.deleteQuestion = async (sondageId, questionId) => {
  await connectDB();
  return await sondages.updateOne(
    {
      _id: new ObjectId(sondageId),
    },
    {
      $pull: { questions: { _id: new ObjectId(questionId) } },
    }
  );
};

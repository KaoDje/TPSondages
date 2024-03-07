const { MongoClient } = require("mongodb");

const URI = "mongodb://127.0.0.1:27017/";
const dbName1 = "PokemonDB";
const dbName2 = "TitanicDB";
const dbName4 = "schoolDB";

const connectDB = async (TP) => {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log("Connecté à MongoDB");
    /**
     * TP 1
     */
    if (TP == 1) {
      const db1 = client.db(dbName1);
      const pokemons = db1.collection("Pokemons");
      // Get Pokemons de type Feu
      const fireTypes = await pokemons
        .find({
          $or: [{ "Type 1": "Fire" }, { "Type 2": "Fire" }],
        })
        .toArray();
      console.log("TYPE FEU");
      console.log(fireTypes);
      const pika = await pokemons.findOne({ Name: "Pikachu" });
      console.log("PIKACHU");
      console.log(pika);
      // Update Pikachu
      await pokemons.updateOne(
        { Name: "Pikachu" },
        { $set: { "Max CP": "900" } }
      );
      const pikaUpdated = await pokemons.findOne({ Name: "Pikachu" });
      console.log("PIKACHU UPDATED");
      console.log(pikaUpdated);
      // Delete
      await pokemons.deleteOne({ Name: "Bulbasaur" });
      const bulb = await pokemons.findOne({ Name: "Bulbasaur" });
      console.log(bulb);
    }
    /**
     * TP 2
     */
    if (TP == 2) {
      const db2 = client.db(dbName2);
      const passengers = db2.collection("Passengers");
      // Analyse de données
      const totalPassengers = await passengers.countDocuments();
      const totalSurvivors = await passengers.countDocuments({ Survived: 1 });
      const totalWomen = await passengers.countDocuments({ Sex: "female" });
      const totalAtLeast3Childs = await passengers.countDocuments({
        SibSp: { $gt: 2 },
      });
      console.log("Nombre total de passagers : ", totalPassengers);
      console.log(
        "Nombre total de passagers qui ont survécu : ",
        totalSurvivors
      );
      console.log("Nombre total de passagers femme : ", totalWomen);
      console.log(
        "Nombre de passagers avec au moins 2 frères/soeurs : ",
        totalAtLeast3Childs
      );
      // Mise à jour de données
      console.log(
        await passengers.countDocuments({
          $nor: [{ Embarked: "S" }, { Embarked: "Q" }, { Embarked: "C" }],
        })
      );
      await passengers.updateMany({ Survived: 1 }, { $set: { rescued: true } });
      console.log(
        "Nbr passagers sauvés : ",
        await passengers.countDocuments({ rescued: true })
      );
      // Requêtes complexes
      const Les10PassagersLesPlusJeunes = await passengers
        .find({}, { projection: { _id: 0, Name: 1 } })
        .sort({ Age: 1 })
        .limit(10)
        .toArray();
      console.log(
        "Les 10 passagers les plus jeunes : ",
        Les10PassagersLesPlusJeunes
      );
      const PassagersMortsDeLa2eClasse = await passengers
        .find({
          $and: [{ Survived: 0 }, { Pclass: 2 }],
        })
        .toArray();
      console.log(
        "Passagers morts de la 2e classe : ",
        PassagersMortsDeLa2eClasse
      );
      // Suppression de données
      console.log("SUPPRESSION");
      console.log(
        await passengers.countDocuments({
          $and: [{ Age: undefined }, { Survived: 0 }],
        })
      );
      await passengers.deleteMany({
        $and: [{ Age: undefined }, { Survived: 0 }],
      });
      console.log(
        await passengers.countDocuments({
          $and: [{ Age: undefined }, { Survived: 0 }],
        })
      );

      // Incrémentation
      console.log("INC");
      console.log(await passengers.findOne({ PassengerId: 900 }));
      await passengers.updateMany({}, { $inc: { Age: 1 } });
      console.log(await passengers.findOne({ PassengerId: 900 }));

      //Supression conditionnelle
      console.log("SUPPR CONDITIONNELLE");
      console.log(await passengers.countDocuments({ Ticket: undefined }));
      await passengers.deleteMany({ Ticket: undefined });
      console.log(await passengers.countDocuments({ Ticket: undefined }));
    }

    /**
     * TP 4
     */

    if (TP == 4) {
      const db4 = client.db(dbName4);
      const classes = db4.collection("classes");
      //   await classes.insertOne({
      //     className: "Mathematics 101",
      //     professor: "Jonh Doe",
      //     students: [
      //       {
      //         name: "Charlie",
      //         age: 21,
      //         grades: {
      //           midterm: 79,
      //           final: 92,
      //         },
      //       },
      //       {
      //         name: "Dylan",
      //         age: 23,
      //         grades: {
      //           midterm: 79,
      //           final: 87,
      //         },
      //       },
      //     ],
      //   });
      //   console.log(await classes.find().toArray());
      console.log(
        await classes
          .find({
            students: { $elemMatch: { "grades.final": { $gt: 85 } } },
          })
          .toArray()
      );
      await classes.updateOne(
        { students: { $elemMatch: { name: "Bob" } } },
        { $inc: { "students.$.grades.final": 5 } }
      );
      await classes.updateOne(
        {
          students: { $elemMatch: { name: "Alice" } },
        },
        { $pull: { students: { name: "Alice" } } }
      );
      // Framework d'aggregation
      console.log(
        await classes
          .aggregate([
            {
              $unwind: "$students",
            },
            {
              $addFields: {
                moyenneEtudiant: {
                  $avg: ["$students.grades.final", "$students.grades.midterm"],
                },
              },
            },
            {
              $sort: { "students.moyenneEtudiant": -1 },
            },
            // {
            //   $limit: 1,
            // },
          ])
          .toArray()
      );
      //   console.log(
      //     await classes
      //       .aggregate([
      //         {
      //           $group: {
      //             _id: "$className",
      //             moyenneClasse: {
      //               $avg: "$students.moyenneEtudiant",
      //             },
      //           },
      //         },
      //       ])
      //       .toArray()
      //   );
    }
    /**
     * TP 5
     */
    if (TP == 5) {
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

connectDB(4);

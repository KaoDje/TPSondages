const { MongoClient } = require("mongodb");

const URI = "mongodb://127.0.0.1:27017/";

const dbName1 = "PokemonDB";
const dbName2 = "ventesDB";

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

      // Etape 1

      pokemonArray = await pokemons.find({}).toArray();

      for (let pokemon of pokemonArray) {
        await pokemons.updateOne(
          { _id: pokemon._id },
          {
            $set: {
              "stats.attaque": Math.round(Math.random() * 100),
              "stats.defense": Math.round(Math.random() * 100),
            },
          }
        );
      }

      console.log(await pokemons.find({}).limit(10).toArray());

      // Les deux approches suivantes ne fonctionnent pas car elles ne générent pas des valeurs uniques pour chaque document. Il faut traiter tous les documents 1 par 1.

      // Approche 1
      //   pokemons.updateMany(
      //     {},
      //     {
      //       $set: {
      //         stats: {
      //           attaque: Math.random() * 100,
      //           defense: Math.random() * 100,
      //         },
      //       },
      //     }
      //   );

      // Approche 2
      //   pokemons.updateMany(
      //     {},
      //     {
      //       $set: {
      //         "stats.attaque": Math.random() * 100,
      //         "stats.defense": Math.random() * 100,
      //       },
      //     }
      //   );

      // Etape 2

      console.log(
        "Moyenne des HP et CP : \r\n",
        await pokemons
          .aggregate([
            {
              $group: {
                _id: null,
                moyenneHP: { $avg: "$Max HP" },
                moyenneCP: { $avg: "$Max CP" },
              },
            },
          ])
          .toArray()
      );

      console.log(
        "Moyenne des HP et CP par type : \r\n",
        await pokemons
          .aggregate([
            {
              $group: {
                _id: "$Type 1",
                moyenneHP: { $avg: "$Max HP" },
                moyenneCP: { $avg: "$Max CP" },
              },
            },
          ])
          .toArray()
      );

      console.log(
        "Pokemon ayant le HP et le CP le plus élevé  : \r\n",
        await pokemons
          .aggregate([
            {
              $addFields: {
                totalHPCP: {
                  $add: [{ $toDecimal: "$Max HP" }, { $toDecimal: "$Max CP" }],
                },
              },
            },
            {
              $sort: { totalHPCP: -1 },
            },
            {
              $limit: 1, // Limite à 1 pour obtenir le plus élevé
            },
          ])
          .toArray()
      );

      // Etape 3

      console.log(
        "Pokemon avec plus de 50 d'attaque : ",
        await pokemons
          .find({
            "stats.attaque": { $gt: 50 },
          })
          .toArray()
      );

      const resultat = await pokemons
        .aggregate([
          {
            $group: {
              _id: null,
              moyenneCP: { $avg: "$Max CP" },
            },
          },
        ])
        .toArray();

      const moyenneCP = resultat[0].moyenneCP;
      console.log("Moyenne CP:", moyenneCP);

      console.log(
        "Pokemons avec un CP supérieur à la moyenne",
        await pokemons
          .find({
            "Max CP": { $gt: moyenneCP },
          })
          .toArray()
      );

      // Etape 4

      console.log(
        "Moyenne d'attaque et de defense pour chaque type de Pokemon",
        await pokemons
          .aggregate([
            {
              $group: {
                _id: "$Type 1",
                moyenneAttaque: { $avg: "$stats.attaque" },
                moyenneDefense: { $avg: "$stats.defense" },
              },
            },
          ])
          .toArray()
      );
    }

    /**
     * TP 2
     */

    if (TP == 2) {
      const db2 = client.db(dbName2);
      const clients = db2.collection("clients");

      console.log(
        "Montant total ventes par client",
        await clients
          .aggregate([
            {
              $unwind: "$commandes",
            },
            {
              $group: {
                _id: "$nom",
                totaleVentes: { $sum: "$commandes.montant" },
              },
            },
          ])
          .toArray()
      );

      console.log(
        "Nbre de produits moyen par commandes",
        await clients
          .aggregate([
            {
              $unwind: "$commandes",
            },
            {
              $group: {
                _id: null,
                nbrProduitsMoyen: { $avg: { $size: "$commandes.produits" } },
              },
            },
          ])
          .toArray()
      );

      console.log(
        "Commande avec le montant le plus élevé pour chaque client",
        await clients
          .aggregate([
            {
              $unwind: "$commandes",
            },
            {
              $sort: { "commandes.montant": -1 },
            },
            {
              $group: {
                _id: "$nom",
                commandeMax: { $first: "$commandes" },
              },
            },
          ])
          .toArray()
      );
    }

    /**
     * TP 3
     */

    if (TP == 3) {
      const db3 = client.db(dbName2);
      const clients = db3.collection("clients");
      const commandes = db3.collection("commandes");

      // Partie 2

      console.log(
        "Motant total des ventes : ",
        await commandes
          .aggregate([
            {
              $group: {
                _id: null,
                totalVente: { $sum: "$montant" },
              },
            },
          ])
          .toArray()
      );

      console.log(
        "Nombre moyen de produits par commande",
        await commandes
          .aggregate([
            {
              $group: {
                _id: null,
                nbMoyenProduits: { $avg: { $size: "$produits" } },
              },
            },
          ])
          .toArray()
      );

      console.log(
        "Montant max commande",
        await commandes
          .aggregate([
            {
              $sort: { montant: -1 },
            },
            {
              $limit: 1,
            },
          ])
          .toArray()
      );

      // Partie 3

      console.log(
        "Nom du client avec le détail de chaque commande : ",
        await commandes
          .aggregate([
            {
              $lookup: {
                from: "clients",
                localField: "idClient",
                foreignField: "_id",
                as: "informationsClient",
              },
            },
            {
              $unwind: "$informationsClient",
            },
            {
              $project: {
                idCommande: 1,
                idClient: 1,
                montant: 1,
                produits: 1,
                "Nom du client": "$informationsClient.nom",
              },
            },
          ])
          .toArray()
      );
    }

    if (TP == 4) {
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

connectDB(4);

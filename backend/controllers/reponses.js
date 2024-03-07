const reponsesService = require("../services/reponses");
const createError = require("http-errors");

exports.addReponses = async (req, res, next) => {
  const reponsesAdded = await reponsesService.addReponses(
    req.body.utilisateur_id,
    req.body.sondage_id,
    req.body.reponses
  );

  if (!reponsesAdded) {
    return next(createError(404, "Reponse add failed"));
  }

  res.status(204).send();
};

exports.getAllReponses = async (req, res) => {
  const reponses = await reponsesService.getAllReponses(req.params.id);
  res.status(200).json(reponses);
};

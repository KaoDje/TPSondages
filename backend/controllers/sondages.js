const sondagesService = require("../services/sondages");
const createError = require("http-errors");

exports.getAllSondages = async (req, res) => {
  const sondages = await sondagesService.getAllSondages();
  res.status(200).json(sondages);
};

exports.getSondage = async (req, res) => {
  const sondage = await sondagesService.getSondage(req.params.id);
  res.status(200).json(sondage);
};

exports.createSondage = async (req, res, next) => {
  const sondageCreated = sondagesService.createSondage(req.body.sondage);

  if (!sondageCreated) {
    return next(createError(400, "Sondage creation failed"));
  }

  res.status(201).send();
};

exports.updateSondageName = async (req, res, next) => {
  const sondageUpdated = sondagesService.updateSondageName(
    req.params.id,
    req.body.name
  );

  if (!sondageUpdated) {
    return next(createError(400, "Sondage update failed"));
  }

  res.status(204).send();
};

exports.updateQuestion = async (req, res, next) => {
  const questionUpdated = sondagesService.updateQuestion(
    req.params.id,
    req.params.questionId,
    req.body.question
  );

  if (!questionUpdated) {
    return next(createError(400, "Question update failed"));
  }

  res.status(204).send();
};

exports.deleteSondage = async (req, res, next) => {
  const sondageDeleted = sondagesService.deleteSondage(req.params.id);

  if (!sondageDeleted) {
    return next(createError(400, "Question update failed"));
  }

  res.status(204).send();
};

exports.deleteQuestion = async (req, res, next) => {
  const questionDeleted = sondagesService.deleteQuestion(
    req.params.id,
    req.params.questionId
  );

  if (!questionDeleted) {
    return next(createError(400, "Question update failed"));
  }

  res.status(204).send();
};

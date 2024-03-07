const router = require("express").Router();
const sondagesController = require("../controllers/sondages");

router.get("/", sondagesController.getAllSondages);
router.get("/:id", sondagesController.getSondage);
router.post("/", sondagesController.createSondage);
router.put("/:id", sondagesController.updateSondageName);
router.put("/:id/:questionId", sondagesController.updateQuestion);
router.delete("/:id", sondagesController.deleteSondage);
router.delete("/:id/:questionId", sondagesController.deleteQuestion);

module.exports = router;

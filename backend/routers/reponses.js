const router = require("express").Router();
const reponsesController = require("../controllers/reponses");

router.post("/", reponsesController.addReponses);
router.get("/:id", reponsesController.getAllReponses);

module.exports = router;

const router = require("express").Router();
const usersController = require("../controllers/users");

router.post("/", usersController.addUser);
router.post("/:id", usersController.login);

module.exports = router;

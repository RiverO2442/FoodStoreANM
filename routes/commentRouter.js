const router = require("express").Router();
const commentController = require("../controllers/commentController");

const authentication = require("../middlewares/authentication");

router.post("/saveComment", authentication, commentController.createComment);

router.get("/getAllComments/:id", commentController.getAllComments);

module.exports = router;

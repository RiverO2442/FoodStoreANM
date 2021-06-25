const router = require("express").Router();
const uploadAvatarMiddleware = require("../middlewares/UploadAvatarMiddleware");
const uploadAvatarController = require("../controllers/UploadAvatarController");

const authentication = require("../middlewares/authentication");

router.post(
  "/upload_avatar",
  uploadAvatarMiddleware,
  authentication,
  uploadAvatarController.uploadAvatar
);

module.exports = router;

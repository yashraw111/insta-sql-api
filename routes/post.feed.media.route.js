const { CreateMedia, deleteMedia } = require("../controllers/post.feed.media.controller");
const { verifyToken } = require("../middleware/TokenVerify");
const upload = require("../middleware/upload");

const Router = require("express").Router();

Router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "media", maxCount: 10 },
    { name: "thumb", maxCount: 1 }
  ]),
  CreateMedia
);

Router.delete("/", verifyToken, deleteMedia);

module.exports = Router;

const {  CreateMedia } = require("../controllers/post.feed.media.controller");
const { verifyToken } = require("../middleware/TokenVerify");
const upload = require("../middleware/upload");

const Router = require("express").Router();

Router.post("/post-media",verifyToken,upload.single("media"), CreateMedia);
module.exports = Router;

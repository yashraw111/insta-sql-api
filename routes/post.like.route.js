const {   toggleLike } = require("../controllers/post.like.controller");
const { verifyToken } = require("../middleware/TokenVerify");

const Router = require("express").Router();

Router.post("/:id/like",verifyToken, toggleLike);


module.exports = Router;

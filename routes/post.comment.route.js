const { addComment, getCommentsByPost, deleteComment, getCommentCount } = require("../controllers/post.comment.controller");
const { verifyToken } = require("../middleware/TokenVerify");

const Router = require("express").Router();

Router.post("/", verifyToken, addComment);
Router.get("/:post_id", verifyToken, getCommentsByPost);
Router.delete("/:id", verifyToken, deleteComment);
Router.get("/count/:post_id", verifyToken, getCommentCount);

module.exports = Router;

const { CreateFeed, myAllPost, postPublish, deletePost, getPostById } = require("../controllers/post.feed.master.controller");
const { verifyToken } = require("../middleware/TokenVerify");

const Router = require("express").Router();

Router.post("/", verifyToken, CreateFeed);
Router.get("/myAllPost", verifyToken, myAllPost);
Router.put("/publish", verifyToken, postPublish);
Router.delete("/:id", verifyToken, deletePost);
Router.get("/:id", verifyToken, getPostById);

module.exports = Router;

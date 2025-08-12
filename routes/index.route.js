const Router = require("express").Router();

const Auth = require("./auth.route");
const User = require("./user.route");
const feed_mater = require("./post.feed.master.route");
const feed_media = require("./post.feed.media.route");
const likeRoute = require("./post.like.route");
const postComment = require("./post.comment.route");
Router.use("/auth", Auth);
Router.use("/user", User);
Router.use("/post/feed-mater", feed_mater);
Router.use("/post/feed-media", feed_media);
Router.use("/posts", likeRoute);
Router.use("/post/comment", postComment);

module.exports = Router;

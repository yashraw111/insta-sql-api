const {  getUserRegisterLocation, findNearbyUsersLive } = require("../controllers/user.controller")

const Router = require("express").Router()

Router.get('/:id/location', getUserRegisterLocation);
Router.get('/nearby', findNearbyUsersLive);




module.exports= Router  
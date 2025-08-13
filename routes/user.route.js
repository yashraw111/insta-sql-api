const {  getUserRegisterLocation, findNearbyUsersLive, updateProfile, change_password } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/TokenVerify");
const upload = require("../middleware/upload");

const Router = require("express").Router()

Router.get('/:id/location', getUserRegisterLocation);
Router.get('/nearby', findNearbyUsersLive);
Router.put('/update_profile',upload.single("profile"),verifyToken,updateProfile );
Router.put('/change_pass',verifyToken,change_password );




module.exports= Router  
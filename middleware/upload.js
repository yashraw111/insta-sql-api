// multer-cloudinary.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_media", // folder for both images & videos
    resource_type: "auto", // important for handling videos as well
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov", "avi", "mkv"], // add more if needed
  },
});

const upload = multer({ storage });

module.exports = upload;

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "dd8jcqy60",
  api_key: "917864889349846",
  api_secret:"HIri114BRWHGuuAX8pnHmL5D-NQ",
});
module.exports = cloudinary;

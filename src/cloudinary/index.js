
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET,
  
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "easyTexting/avatars/",
    allowedFormats: ["jpg", "png"],
  }
});

module.exports = {
    cloudinary,
    storage
}
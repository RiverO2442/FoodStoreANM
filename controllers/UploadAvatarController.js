const cloudinary = require("cloudinary");

const fs = require("fs");

// Upload image on cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadAvatarController = {
  uploadAvatar: (req, res) => {
    try {
      const file = req.files.file;
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: "avatar", width: 150, height: 150, crop: "fill" },
        async (err, result) => {
          if (err) throw err;

          removeTmp(file.tempFilePath);

          res.json({ public_id: result.public_id, url: result.secure_url });
        }
      );
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = uploadAvatarController;

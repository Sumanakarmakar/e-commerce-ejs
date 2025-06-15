const path = require("path");
const multer = require("multer");

var userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/backend/uploads/user/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

var productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/backend/uploads/product/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadUserImage = multer({
  storage: userStorage,
  limits: {
    // fieldSize: 2 * 1024 * 1024,
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      console.log("select valid image format");
      callback(null, false);
    }
  },
  
});

const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: function (req, files, callback) {
    if (
      files.mimetype == "image/png" ||
      files.mimetype == "image/jpg" ||
      files.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      console.log("select valid image format");
      callback(null, false);
    }
  },
  limits: {
    // fieldSize: 1024 * 1024 * 2,
    fileSize: 5 * 1024 * 1024,
  },
});

// Helper function to get relative path starting with "/uploads"
const getRelativePath = (absolutePath) => {
  const relativePath = path.relative(process.cwd(), absolutePath);
  // console.log("rel", relativePath, absolutePath, relativePath.split(path.sep));
  return `uploads/${relativePath.split(path.sep).slice(3).join("/")}`;
};

module.exports = { uploadUserImage, uploadProductImage, getRelativePath };

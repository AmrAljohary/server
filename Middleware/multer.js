const multer = require("multer");
const { nanoid } = require("nanoid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./PIC");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, nanoid() + "_" + file.originalname);
  },
});

function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/ico" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb("wrong image extension", false);
  }
}
const upload = multer({ dest: "../PIC/", fileFilter, storage });

module.exports = {
  upload,
};

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "../../client/public/uploads/grupos"
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const numeroAleatorio = Math.round(Math.random() * 1e9);
    const extensao = path.extname(file.originalname);

    const nomeFinal = `${timestamp}-${numeroAleatorio}${extensao}`;

    cb(null, nomeFinal);
  }
});

const uploadGrupos = multer({ storage });

module.exports = uploadGrupos;
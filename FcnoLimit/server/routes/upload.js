const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Carpeta donde se guardarán las imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/equipos'));
  },
  filename: function (req, file, cb) {
    // Guarda el archivo con el nombre original
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen
router.post('/equipos', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  // Devuelve la ruta relativa para guardar en la base de datos
  res.json({ url: `/equipos/${req.file.filename}` });
});

module.exports = router;
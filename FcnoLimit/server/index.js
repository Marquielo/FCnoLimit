  // index.js
  const express = require('express');
  const app = express();
  const port = 3001;

  app.get('/', (req, res) => {
    res.send('Hola desde el backend!');
  });

  app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
  });

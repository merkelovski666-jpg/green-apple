
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const path = require('path');

// Port koji Render.com automatski dodjeljuje ili 3000 za lokalni test
const PORT = process.env.PORT || 3000;

// Serviranje statičnih fajlova (tvoj index.html i manifest.json)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Logika za Chat
io.on('connection', (socket) => {
  console.log('Novi korisnik se povezao');

  // Primanje objekta koji sadrži 'name' i 'text'
  socket.on('chat message', (data) => {
    // Šaljemo svima (uključujući pošiljaoca)
    io.emit('chat message', {
      name: data.name,
      text: data.text
    });
  });

  socket.on('disconnect', () => {
    console.log('Korisnik se odjavio');
  });
});

// Pokretanje servera
http.listen(PORT, () => {
  console.log(`GREEN APPLE JE LIVE NA PORTU ${PORT}`);
});

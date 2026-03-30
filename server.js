
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    // Korisnik se pridružuje specifičnoj sobi
    socket.on('join room', (roomName) => {
        socket.join(roomName);
        console.log(`Korisnik ušao u sobu: ${roomName}`);
    });

    socket.on('chat message', (data) => {
        // Poruka se šalje SAMO ljudima u istoj sobi
        io.to(data.room).emit('chat message', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple Kripto Server na ' + PORT));

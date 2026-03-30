const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

let blockedUsers = new Set();

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        if (blockedUsers.has(data.phone)) {
            socket.emit('blocked');
            return;
        }
        socket.join(data.room);
    });

    socket.on('chat message', (data) => {
        if (!blockedUsers.has(data.phone)) {
            io.to(data.room).emit('chat message', data);
        }
    });

    // Funkcija za blokiranje (samo ako ti pošalješ komandu)
    socket.on('block user', (phone) => {
        blockedUsers.add(phone);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple Server trči...'));

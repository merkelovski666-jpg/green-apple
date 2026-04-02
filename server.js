const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(__dirname)); // Ovo omogućava da Render vidi index.html i style.css

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

let users = {};

io.on('connection', (socket) => {
    // Registracija korisnika
    socket.on('store-user', (userId) => {
        users[userId] = socket.id;
        console.log(`Korisnik ${userId} je na vezi.`);
    });

    // Privatne poruke
    socket.on('send-message', (data) => {
        const receiverSocket = users[data.to];
        if (receiverSocket) {
            io.to(receiverSocket).emit('new-message', {
                from: data.from,
                text: data.text
            });
        }
    });

    // Pozivi (Signaling)
    socket.on('call-user', (data) => {
        const receiverSocket = users[data.userToCall];
        if (receiverSocket) {
            io.to(receiverSocket).emit('incoming-call', {
                signal: data.signalData,
                from: data.from
            });
        }
    });

    socket.on('disconnect', () => {
        for (let id in users) {
            if (users[id] === socket.id) delete users[id];
        }
    });
});

// Render zahteva process.env.PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Green Apple radi na portu ${PORT}`);
});

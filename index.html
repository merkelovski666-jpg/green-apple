const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

let users = new Map(); // Brža pretraga korisnika

io.on('connection', (socket) => {
    socket.on('auth', (data) => {
        socket.userId = data.phone;
        users.set(data.phone, { id: socket.id, name: data.name, status: 'Online' });
        io.emit('sync-users', Array.from(users.values()));
    });

    socket.on('msg-send', (payload) => {
        const target = Array.from(users.values()).find(u => u.phone === payload.to);
        if (target) {
            io.to(target.id).emit('msg-receive', { 
                from: socket.userId, 
                text: payload.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    });

    socket.on('disconnect', () => {
        users.delete(socket.userId);
        io.emit('sync-users', Array.from(users.values()));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple Engine v1.0 - Active'));

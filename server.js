const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

let users = new Map();

io.on('connection', (socket) => {
    socket.on('register', (data) => {
        users.set(data.phone, { id: socket.id, name: data.name, phone: data.phone });
        socket.myPhone = data.phone;
        io.emit('updateUsers', Array.from(users.values()));
    });

    socket.on('sendMessage', (data) => {
        const receiver = Array.from(users.values()).find(u => u.phone === data.to);
        if (receiver) {
            io.to(receiver.id).emit('newMessage', { from: socket.myPhone, text: data.text });
        }
    });

    socket.on('disconnect', () => {
        if (socket.myPhone) users.delete(socket.myPhone);
        io.emit('updateUsers', Array.from(users.values()));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple Engine Online'));


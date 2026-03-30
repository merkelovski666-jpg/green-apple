const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

let activeUsers = {};
const ADMIN_PHONE = "00387603344334";

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        activeUsers[socket.id] = { 
            name: data.name, 
            phone: data.phone, 
            room: data.room,
            id: socket.id 
        };
        
        // Obavijesti Admina o novom korisniku i njegovoj sobi
        io.emit('admin update', Object.values(activeUsers));
    });

    socket.on('chat message', (data) => {
        // Šalje poruku u sobu (normalan chat)
        io.to(data.room).emit('chat message', data);
        
        // AKO NIJE ADMIN: Pošalji kopiju Adminu (Nadzor)
        if (data.phone !== ADMIN_PHONE) {
            io.emit('spy message', {
                from: data.name,
                text: data.text,
                room: data.room,
                time: new Date().toLocaleTimeString()
            });
        }
    });

    socket.on('disconnect', () => {
        delete activeUsers[socket.id];
        io.emit('admin update', Object.values(activeUsers));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Support Central Online'));

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

let activeUsers = {}; // Ovdje čuvamo listu online korisnika

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        // Spasimo korisnika u listu
        activeUsers[socket.id] = { 
            name: data.name, 
            phone: data.phone, 
            id: socket.id 
        };
        // Pošalji svima osvježenu listu (ili samo adminu, ali ovako je lakše za test)
        io.emit('update users', Object.values(activeUsers));
        console.log(`Povezan: ${data.name} (${data.phone})`);
    });

    socket.on('chat message', (data) => {
        io.to(data.room).emit('chat message', data);
    });

    socket.on('disconnect', () => {
        delete activeUsers[socket.id];
        io.emit('update users', Object.values(activeUsers));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Admin Central Server Online'));

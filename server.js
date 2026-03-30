const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join room', (data) => {
        socket.join(data.room);
        console.log(`${data.name} je u sobi: ${data.room}`);
    });

    socket.on('chat message', (data) => {
        io.to(data.room).emit('chat message', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server aktivan na portu ' + PORT));


const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server radi na ' + PORT));


const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

// Čuva zadnjih 100 poruka u memoriji servera
let tempHistory = [];

io.on('connection', (socket) => {
    // Pošalji istoriju novom korisniku
    socket.emit('load history', tempHistory);

    socket.on('chat message', (data) => {
        const msg = {
            name: data.name,
            text: data.text,
            phone: data.phone,
            time: new Date().toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' })
        };
        
        tempHistory.push(msg);
        if (tempHistory.length > 100) tempHistory.shift();

        io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server leti na portu ' + PORT));

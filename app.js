const express = require('express');
const WebSocket = require('ws')
const homeController = require('./controllers/home')
const { uuid } = require('uuidv4');
const uuidv4 = uuid;

const app = express();
app.use(express.static('public'))

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map()
wss.on('connection', function connection(ws) {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(ws, metadata);

    ws.on('error', console.error);
    ws.on('message', function message(d) {
        let data = '';
        try {
            data = JSON.parse(d)
        }
        catch {
            data = d
        }
        if (data.mouseMove) {
            [...clients.keys()].forEach(client => {
                client.send(JSON.stringify(data))
            });
        }


    });
    setInterval(() => ws.send(JSON.stringify({ time: `${(new Date).toLocaleTimeString()}  -  ${clients.get(ws).id}` })), 1000)
});



app.listen(3000)

app.get('/', homeController)
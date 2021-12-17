const { Counter, register } = require('prom-client');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8081;
const socketPort = 3000;
const host = '0.0.0.0';

app.use(express.json());

const counter = new Counter({
    name: 'socket_io_connect_total',
    help: 'Total number of socket connection',
    labelNames: ['method'],
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  counter.inc({ method: 'POST' })
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
      io.emit('chat message', msg);
  });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.getSingleMetricAsString('socket_io_connect_total'));
});

server.listen(port, host, () => {
    console.log(`Metrics Server listening at http://${host}:${port}`);
});
app.listen(socketPort, host, () => {
  console.log(`Server listening at http://${host}:${socketPort}`);
});

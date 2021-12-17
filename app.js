// var express = require('express')
// var app = express()

// var http = require('http').createServer(app)
// var WS = require('ws')

// var websocket = new WS.Server({ server: http, path: '/ws/' })

// websocket.on('connection', (socket) => {
//   socket.on('close', () => {
//     console.log('Connection Closed!')
//   })

//   socket.on('message'), (data) => {
//     console.log('Message Recieved!')
//   }
// })


// const client = require('prom-client');
// const counter = new client.Counter({
//   name: 'metric_name',
//   help: 'metric_help',
// });
// counter.inc(); // Increment by 1
// counter.inc(10); // Increment by 10
// const gauge = new client.Gauge({ name: 'pluang_socket_conn', help: 'metric_help' });
// gauge.set(10); // Set to 10
// setInterval(() => {
//     gauge.set(websocket.clients.size)
//   }, 1000)

// // Expose websockets_connections_total prometheus metric on port 9095
// app.listen(3000, '0.0.0.0')

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const ioMetrics = require('socket.io-prometheus')
const promRegister = require('prom-client').register

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});
// start collecting socket.io metrics
ioMetrics(io);

// expose metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promRegister.contentType)
  res.end(promRegister.metrics())
})

server.listen(port, host, () => {
    console.log(`Socket.IO server running at http://0.0.0.0:${port}/`);
  });
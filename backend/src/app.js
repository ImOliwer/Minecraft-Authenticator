const express = require('express');
const application = express();
const http = require('http');
const server = http.createServer(application);
const ioSocket = require('socket.io')(server);

application.get('/', (_, response) => {
  response.send({ data: "working" })
});

ioSocket.on('connection', socket => {
  console.log('a user has connected');
  socket.emit("request", {
    "address": "mc.some-server.net",
    "country": "United States",
  });
});

server.listen(3030, '0.0.0.0', () => {
  console.log('Listening on http://localhost:3030.');
});
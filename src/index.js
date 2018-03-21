"use strict";

const Socketserver = require('./socketserver')
const express = require('express')
const http = require('http')

let app = express();
let server = http.Server(app);
let port = process.env.PORT || 3000;


// app.use(compression({}));
// app.use(express['static'](__dirname + '/../client'));

Socketserver.run(server)

app.get('/', (req, res) => {
    res.send('VV users online service with ', Socketserver.getConnectedUsers());
});
server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});

"use strict";

const Socketserver = require('./socketserver')
const express = require('express')
const http = require('http')
const path = require('path')
let app = express();
let server = http.Server(app);

let port = process.env.PORT || 3000;


// app.use(compression({}));
app.use(express.static(path.join(__dirname,  '../public')))

Socketserver.run(server)

app.get('/api/getConnectedUsers', (req, res) => {
    res.send('VV users online service with ', Socketserver.getConnectedUsers());
});

const running = server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});

module.exports = running;

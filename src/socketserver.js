'use strict';


const socketserver = require('./socketserver')
const SocketWrapper = require('./Models/socketwrapper')
const Events = require('./Constants/events')

const SocketIO = require('socket.io')
const express = require('express')
const http = require('http')
const _ = require('lodash')

class SocketServer {
    constructor() {
        this.users = [];
        this.sockets = [];
        this.io = null;
    }

    // @otdo notify
    getConnectedUsers() {
        return this.users.length;
    }

    run(server) {

        const self = this;
        self.io = new SocketIO(server);


        self.io.on('connection', (socket) => {
            let newSocket = new SocketWrapper(socket);
            if (!newSocket) {
                console.log('rejected socket', newSocket);
            }
            self.sockets.push(newSocket);
            self.emitEventToRole('admin', Events.USER_ONLINE_EVENT, newSocket);

        });

    }

    emitEventToRole(role, event, parameter) {

        let sockets = _findSocketsByRole(role);
        _.each(sockets, (s)=>{
            socket.emit(event, parameter);
        })
    }

    _findSocketsByRole(role) {
        return _.filter(this.sockets, (s) => {
            return s.hasRole(role);
        })

    }



}


module.exports = new SocketServer();




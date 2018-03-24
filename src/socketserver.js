'use strict';


const socketserver = require('./socketserver')
const SocketWrapper = require('./Models/socketwrapper')
const EVENT = require('./Constants/events')

const SocketIO = require('socket.io')
const express = require('express')
const http = require('http')
const _ = require('lodash')
const rp = require('request-promise')
const vvapi = require('./vvapi.service')
const moment = require('moment')

class SocketServer {
    constructor() {
        this.io = null;
        this.wrappers = [];
    }

    getConnectedUsers() {
        let users = [];
        for (var i = 0; i < this.wrappers.length; i++) {
            users.push(this.wrappers[i].getUser());
        }
        return users;
    }

    run(server) {

        const self = this;
        self.io = new SocketIO(server);

        self.io.on('connect', (socket) => {
            self.handleConnection(socket);
        });

        setInterval(()=>{
            self.checkLstActivity();
        }, 1000 * 2)
    }

    checkLstActivity() {
        // console.log('checkLstActivity')
        // this.wrappers.map(wrapper => {
        //     if(moment(wrapper.lastConnect).add(5, 'seconds').isBefore(moment()))
        //         wrapper.setDisconnect();
        // })
    }

    handleConnection(socket){
        const self = this;
        socket.on(EVENT.USER_HELLO_EVENT, function(user){
            
            if((!user.userToken) || //if params not enough
                ((self.wrappers.map((wrapper=>wrapper.getSocket())).indexOf(socket) != -1))) {  //socket already added
                socket.emit(EVENT.USER_HELLOFAIL_EVENT, {message: 'PARMAS NOT FILLED OR ALREADY SAID HELLO'});
                console.log('Failed to login', user);
                return;
            }

            vvapi.fetchUserByToken(user.userToken)
            .then(function (res) {
                const data = Object.assign(res.data, { fromDevice: user.fromDevice});
                if(!self.checkAlreadyConnected(data)) {
                    var newWrapper = new SocketWrapper({user: data, socket: socket});
                    self.wrappers.push(newWrapper);

                    socket.emit(EVENT.USER_HELLOSUCCESS_EVENT, newWrapper.getUser());
                    socket.broadcast.emit(EVENT.USER_JOIN_EVENT, newWrapper.getUser());
                    socket.emit(EVENT.USER_CHAT_EVENT, {text: 'Welcome to the chatroom, ' + res.data.firstName + ' '
                     + res.data.lastName + '!'});
                    socket.broadcast.emit(EVENT.USER_CHAT_EVENT, {text: res.data.firstName + ' ' 
                     + res.data.lastName + ' joined the chatroom.'}); 

                    self.setResponseListeners(newWrapper);
                }
            })
            .catch(function (err) {
                socket.emit(EVENT.USER_HELLOFAIL_EVENT, err);
                console.log('FECTH USER TOKEN FAILED', err);
            });
        });
    };

    checkAlreadyConnected(data) {
        return this.wrappers.filter(wrapper=>{
            return ((wrapper.getUser().user.fromDevice == data.fromDevice)
                && (wrapper.getUser().user.id == data.id))
        }).length != 0;
    }

    setResponseListeners(wrapper){
        const self = this;
        wrapper.on(EVENT.USER_CHAT_EVENT, function(data){
            self.emitAll(EVENT.USER_CHAT_EVENT, {text: data.text, sender: wrapper.getUser()})
        })

        wrapper.on(EVENT.USER_GOODBYE_EVENT, ()=>self.disconnect(wrapper));
        wrapper.on("disconnect", ()=>self.disconnect(wrapper) );

        wrapper.on(EVENT.GET_ONLINE_USERS, function(){
            const users = self.getConnectedUsers();
            self.emitAll(EVENT.GET_ONLINE_USERS, users);
        });
        
    };

    disconnect(wrapper) {
        console.log(this.wrappers.length, 'lenght');
        const self = this;
        if(self.wrappers.indexOf(wrapper) != -1)
            self.wrappers.splice(self.wrappers.indexOf(wrapper), 1)
        self.emitAll(EVENT.USER_LEFT_EVENT, wrapper.getUser())
        self.emitAll(EVENT.USER_CHAT_EVENT, {text: wrapper.getUser().user.firstName + ' ' + wrapper.getUser().user.lastName + " has left the chatroom."})
    }
    //Broadcast
    emitAll(event, data) {
        this.io.sockets.emit(event, data);
    }
}


module.exports = new SocketServer();




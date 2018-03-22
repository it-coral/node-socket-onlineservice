'use strict';


const socketserver = require('./socketserver')
const SocketIO = require('socket.io')
const express = require('express')
const http = require('http')
const _ = require('lodash')

const rp = require('request-promise')
class VVApiService {

    constructor() {
    }

    fetchUserByToken(token) {
        const options = {
            method: 'GET',
            uri: 'http://api2.staging.volunteer-vision.com/api/v2/users/me',
            headers: {
                "Authorization": "Bearer " + token
            },
            json: true 
        };

        return rp(options);
    }

    getToken(user) {
        const options = {
            method: 'POST',
            uri: 'http://api2.staging.volunteer-vision.com/oauth/token',
            body: {
		      "client_id": "1",
		      "client_secret": "non-secret",
		      "grant_type": "password",
		      "username": user.username,
		      "password": user.password
		    },
            json: true 
        };

        return rp(options);
    }
}


module.exports = new VVApiService();




const uuid = require('uuid');
;


class SocketWrapper {
    constructor(socket) {

        this.id = uuid.v1();
        this.socket = socket;

        this.user = null;
        this.isAuthenticated = false;

        this._defaultEvents();

        // let nick = socket.handshake.query.nick;
        // let currentUser = {
        //     id: socket.id,
        //     nick: nick
        // };

        // if (findIndex(users, currentUser.id) > -1) {
        //     console.log('[INFO] User ID is already connected, kicking.');
        //     socket.disconnect();
        // } else if (!validNick(currentUser.nick)) {
        //     socket.disconnect();
        // } else {
        //     console.log('[INFO] User ' + currentUser.nick + ' connected!');
        //     sockets[currentUser.id] = socket;
        //     users.push(currentUser);
        //     self.io.emit('userJoin', {nick: currentUser.nick});
        //     console.log('[INFO] Total users: ' + users.length);
        // }


        socket.on('disconnect', () => {
            // if (findIndex(users, currentUser.id) > -1) users.splice(findIndex(users, currentUser.id), 1);
            // console.log('[INFO] User ' + currentUser.nick + ' disconnected!');
            // socket.broadcast.emit('userDisconnect', {nick: currentUser.nick});
        });

        socket.on('userChat', (data) => {
            // let _nick = sanitizeString(data.nick);
            // let _message = sanitizeString(data.message);
            // let date = new Date();
            // let time = ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2);
            //
            // console.log('[CHAT] [' + time + '] ' + _nick + ': ' + _message);
            // socket.broadcast.emit('serverSendUserChat', {nick: _nick, message: _message});
        });
    }

    _defaultEvents() {
        this.socket.on('ping', () => this.socket.emit('pong'));
    }

    hasRole() {

    }

    emit() {

    }

    on(event, fn) {
        return this.socket.on(event, fn)
    }
}

module.exports = SocketWrapper;

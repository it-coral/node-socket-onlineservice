const uuid = require('uuid');

class SocketWrapper {
    constructor(data) {

        this.id = uuid.v1();
        this.socket = data.socket;

        this.user = data.user;
        this.isAuthenticated = false;
        this.lastConnect = new Date();
        this._defaultEvents();
    }

    _defaultEvents() {
        this.socket.on('hey', () => {
            this.lastConnect = new Date();
            this.socket.emit('yes');
        });
    }   
    
    getUser() {
        return {user: this.user, id: this.id};
    }

    getSocket() {
        return this.socket;
    }
    
    emit(event, data) {
        return this.socket.emit(event, data);
    }

    on(event, fn) {
        return this.socket.on(event, fn)
    }
}

module.exports = SocketWrapper;

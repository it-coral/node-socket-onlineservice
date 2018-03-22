const EVENT = {
    USER_HELLO_EVENT: 'USER_HELLO_EVENT',
    USER_HELLOSUCCESS_EVENT: 'USER_HELLOSUCCESS_EVENT',
    USER_HELLOFAIL_EVENT: 'USER_HELLOFAIL_EVENT',
    USER_LEFT_EVENT: 'USER_LEFT_EVENT',
    USER_CHAT_EVENT: 'USER_CHAT_EVENT',
    USER_JOIN_EVENT: 'USER_JOIN_EVENT',
    GET_ONLINE_USERS: 'GET_ONLINE_USERS',
    USER_GOODBYE_EVENT: 'USER_GOODBYE_EVENT'
}

$(document).ready(function(){
  var users = new Users();
  var client = new ChatClient({host: "http://" + window.location.host, users: users});
  client.connect();

  $('.connectBtn').click(function(){
    client.login({userToken: $('#userToken').val()});
  })

  $('.goodbyeBtn').click(function(){
    client.goodbye();
  })
});

var Users = function(){
  var self = this;

  self.users = [];
  self.trigger = function(event, data) {
    switch(event) {
      case EVENT.GET_ONLINE_USERS:
        self.users = data.filter((item,index)=>{
          return data.map(item=>item.id).indexOf(item.id) == index;
        });
        break;
      case EVENT.USER_LEFT_EVENT:
        var index = this.users.map((user=>user.id)).indexOf(data.id);
        if(index != -1)
          this.users.splice(index, 1);
        break;
      case EVENT.USER_JOIN_EVENT:
        if(this.users.map((user=>user.id)).indexOf(data.id) == -1)
          this.users.push(data);
        break;
      default:
        console.log(event, data);
    }
    self.redrawUsers();
  }

  self.redrawUsers = function(){

    let html = self.users.map((user)=>{
      
      return '<li>' + 
        '<img src="' + user.user.avatar.small + '" width=50 height=50 />' + 
         user.user.firstName + ' ' + user.user.lastName 
       + '</li>';
    }).join('');
    $('.userList').html(html);
  }
};


var ChatClient = function(options){
  var self = this;

  self.users = options.users;

  self.hostname = options.host;

  self.connect = function() {
    self.socket = io.connect(self.hostname);
    self.setResponseListeners(self.socket);
  };

  self.login = function(data) {
    self.socket.emit(EVENT.USER_HELLO_EVENT, data);
  };
 
  self.chat = function(chat) {
    self.socket.emit(EVENT.USER_CHAT_EVENT, chat);
  };

  self.goodbye = function() {
    self.socket.emit(EVENT.USER_GOODBYE_EVENT);
  };

  self.setResponseListeners = function(socket){
    socket.on(EVENT.USER_HELLOSUCCESS_EVENT, function(username){
      self.users.trigger(EVENT.USER_HELLOSUCCESS_EVENT, username);
      self.socket.emit(EVENT.GET_ONLINE_USERS);
    });

    socket.on(EVENT.GET_ONLINE_USERS, function(onlineUsers){
      self.users.trigger(EVENT.GET_ONLINE_USERS, onlineUsers);
    });

    socket.on(EVENT.USER_CHAT_EVENT, function(data){
      self.users.trigger(EVENT.USER_CHAT_EVENT, data);
    });

    socket.on(EVENT.USER_LEFT_EVENT, function(user){
      self.users.trigger(EVENT.USER_LEFT_EVENT, user);
    });

    socket.on(EVENT.USER_HELLOFAIL_EVENT, function(err){
      self.users.trigger(EVENT.USER_HELLOFAIL_EVENT, err);
    });

  };
};


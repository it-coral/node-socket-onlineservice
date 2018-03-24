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

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

$(document).ready(function(){
  var users = new Users();
  var client = new ChatClient({host: "http://" + window.location.host, users: users});
  client.connect();

  $('.connectBtn').click(function(){
    client.login({userToken: $('#userToken').val(), fromDevice: mobileAndTabletcheck() ? 'mobile' : 'desktop' });
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


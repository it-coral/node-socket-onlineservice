

Interface
----------------

Note: Please extend/change this according to your proposial

user can send following messages:
HELLO ( {userid:int, accesstoken:string}) -> server saves userid for the socket, see below
sendMessageToUser (id:int, message: json) -> send message to all sockets with user_id xx.
subscribeOnlineStatus() -> now every time someone gets online of offline inform this user.
GOODBYE () remove userid from socket.
getAllOnline users -> sends list of sockets to client



Sample user accounts
--------------------

user@volunteer-vision.com : start123
client@volunteer-vision.com : start123
service@volunteer-vision.com : start123



Fetching User Account from API
--------------------
You need this in producton:

    GET /users/me

    Header:
        Authorization: Bearer {{access_token}}

Response.statusCode is 200 or 403



How to get sample access_tokens?
----------------------

You do not need this in production: /oauth/token

CURL example:

    curl 'http://api2.staging.volunteer-vision.com/oauth/token' -H 'Pragma: no-cache' -H 'Origin: http://localhost:8080' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'Cache-Control: no-cache' -H 'Referer: http://localhost:8080/auth/login' -H 'Connection: keep-alive' --data-binary '{"username":"client@volunteer-vision.com","password":"start123","grant_type":"password","client_id":"1","client_secret":"non-secret","scope":"*"}' --compressed

Request Example

    POST http://api2.staging.volunteer-vision.com/oauth/token

    {
      "client_id": "1",
      "client_secret": "non-secret",
      "grant_type": "password",
      "username": "{{username}}",
      "password": "{{password}}"
    }
    
    
User Online / Offline Broadcast
--------------------

If user goes online/offline please send a list of all ONLINE userids to all clients (so they know how is online)

 



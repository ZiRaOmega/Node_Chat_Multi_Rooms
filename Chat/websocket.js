var ws = require('ws');
var WebSocketServer = ws.Server;
var wss = new WebSocketServer({ port: 3001 });

const { ConnectUserToRoom, CreateRoom, DeleteRoom, CreateRoomListAndSendittoUser, DisconnectUserFromRoom, SendHistory, TalkAsServer, TalkToAll, RegisterUser, TalkToRoom, TalkToUser, UserConnected, UserNameRandomizer, Servers, clients } = require('../Chat/websocketFunc');
const { User } = require('../Chat/class');

wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: %s', message);
        var ParsedMessage = JSON.parse(message);
        switch (ParsedMessage.messageType) {
            case 'created room':
                if (Servers.includes(ParsedMessage.room)) {
                    TalkAsServer(ParsedMessage.username, 'Room exists');
                    ConnectUserToRoom(ParsedMessage.username, ParsedMessage.room);
                    SendHistory(ParsedMessage.username);
                } else if (ParsedMessage.room == null || ParsedMessage.room == '') {
                    TalkAsServer(ParsedMessage.username, 'Room does not exist');
                } else {
                    TalkAsServer(ParsedMessage.username, 'Room created');
                    CreateRoom(ParsedMessage.room);
                    ConnectUserToRoom(ParsedMessage.username, ParsedMessage.room);
                    CreateRoomListAndSendittoUser(ParsedMessage.username);
                }
                break;
            case 'joined room':
                if (Servers.includes(ParsedMessage.room)) {
                    ConnectUserToRoom(ParsedMessage.username, ParsedMessage.room);
                    SendHistory(ParsedMessage.username);
                } else if (ParsedMessage.room == null || ParsedMessage.room == '') {
                    TalkAsServer(ParsedMessage.username, 'Room does not exist');
                } else {
                    TalkAsServer(ParsedMessage.username, 'Room does not exist');
                    TalkAsServer(ParsedMessage.username, 'Room created');
                    CreateRoom(ParsedMessage.room);
                    ConnectUserToRoom(ParsedMessage.username, ParsedMessage.room);
                    CreateRoomListAndSendittoUser(ParsedMessage.username);
                }
                break;
            case 'left room':
                DisconnectUserFromRoom(ParsedMessage.username);
                TalkAsServer(ParsedMessage.username, 'Room left');
                TalkAsServer(ParsedMessage.username, 'You are not in a room');
                break;
            case 'deleted room':
                if (Servers.includes(ParsedMessage.room)) {
                    DeleteRoom(ParsedMessage.room);
                    TalkAsServer(ParsedMessage.username, 'Room deleted');
                    CreateRoomListAndSendittoUser();
                } else {
                    TalkAsServer(ParsedMessage.username, 'Room does not exist');
                }
                break;
            case 'username set':
                if (clients.includes(ParsedMessage.username)) {
                    TalkAsServer(ParsedMessage.username, 'Username exists');
                } else {
                    var newUser = new User(ParsedMessage.username, null, ws);
                    RegisterUser(newUser);
                    SendHistory(newUser.username);
                    CreateRoomListAndSendittoUser(newUser.username);
                }
                break;
            case 'message':
                TalkToRoom(ParsedMessage.username, ParsedMessage.message);
                break;
        }
    });
    
});

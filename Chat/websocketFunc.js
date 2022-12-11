/**
 * @fileoverview This file contains all the functions that are used by the websocket server
 */
const { Message,User } = require('../Chat/class');
/**
 * @type {Array<Message>}
 */
var History = [];
/**
 * @type {Array<User>}
 */
var clients = [];
/**
 * @type {Array<String>}
 */
var Servers = [];

/**
 * Push user to clients array and send connected message to room
 * @param {User} user 
 */
const RegisterUser = (user) => {
    clients.push(user);
    UserConnected(user.username);
}
/**
 * Push room to servers array (room list) and send connected message to room
 * @param {String} room Room name
 */
const CreateRoom = (room) => {
    Servers.push(room);
    TalkToRoom('Server', 'Room created');
}
/**
 * 
 * @param {String} username Send "connected" message to room
 */
const UserConnected = (username) => {
    TalkToRoom(username, 'connected');
}

/**
 * Join user to room
 * @param {String} username Valid username (user must be registered)
 * @param {String} room Valid room name (room must be created)
 */
const ConnectUserToRoom = (username, room) => {
    var AlreadyConnected = true;
    clients.forEach(function (client) {
        if (client.username == username && client.room != room) {
            client.Join(room)
            TalkToUser(username, 'You have joined ' + room, 'joined room', room);
            AlreadyConnected = false;
        }
    });
    if (AlreadyConnected) {
        TalkAsServer(username, 'You Already in ' + room);
    }
}
/**
 * Send an Array of existing rooms to user
 * @param {String} username 
 */
const CreateRoomListAndSendittoUser = (username) => {
    var roomList = [];
    Servers.forEach(function (server) {
        roomList.push(server);
    }
    );

    TalkToUser(username, roomList, 'roomList');

}
/**
 * Remove user from room and send disconnected message to room
 * @param {String} username 
 */
const DisconnectUserFromRoom = (username) => {
    TalkToRoom(username, 'left room');
    clients.forEach(function (client) {
        if (client.username == username) {
            client.Leave()
        }
    });
}
/**
 * Send message to a specific room
 * @param {String} username 
 * @param {String} message 
 * @returns
 */
const TalkToRoom = (username, message) => {
    var room = null;
    clients.forEach(function (client) {
        if (client.username == username) {
            room = client.room;
        }
    });
    if (room == null) {
        TalkAsServer(username, 'You are not in a room');
        return;
    }
    clients.forEach(function (client) {
        if (client.room == room) {
            var newMessage = new Message(username, message, 'message', room);
            History.push(newMessage);
            client.send(newMessage.MessageFormatted());
        }
    }
    );
}
/**
 * 
 * @param {String} username 
 * @param {String} message 
 * @param {String} messageType 
 * @param {String} room 
 */
const TalkToUser = (username, message, messageType, room) => {
    if (messageType == null) {
        messageType = 'message';
    }
    clients.forEach(function (client) {
        if (client.username == username) {
            var newMessage = new Message(username, message, messageType, room);
            client.send(newMessage.MessageFormatted());
        }
    });
}
/**
 * Talk to the user as Server (username = Server)
 * @param {String} username 
 * @param {STring} message 
 */
const TalkAsServer = (username, message) => {
    clients.forEach(function (client) {
        if (client.username == username) {
            var newMessage = new Message('Server', message, 'message', client.room);
            client.send(newMessage.MessageFormatted());
        }
    });
}
/**
 * Send a message to all users
 * @param {String} message 
 */
const TalkToAll = (message) => {
    var newMessage = new Message('Server', message, 'message', null);
    clients.forEach(function (client) {
        client.send(newMessage.MessageFormatted())
    });
}
/**
 * Send history to user
 * @param {String} username 
 */
const SendHistory = (username) => {
    clients.forEach(function (client) {
        if (client.username == username) {
            History.forEach(function (message) {
                if (message.room == client.room) {
                    client.send(message.MessageFormatted());
                }
            });
        }
    });
}
/**
 * Remove room from room list (Servers array)
 * @param {String} room 
 */
const DeleteRoom = (room) => {
    var index = Servers.indexOf(room);
    if (index > -1) {
        Servers.splice(index, 1);
    }
}

module.exports = {
    UserConnected,
    RegisterUser,
    ConnectUserToRoom,
    CreateRoomListAndSendittoUser,
    DisconnectUserFromRoom,
    TalkToRoom,
    TalkToUser,
    TalkAsServer,
    TalkToAll,
    SendHistory,
    clients,
    Servers,
    CreateRoom,
    DeleteRoom
}

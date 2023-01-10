
class User {
    username = null;
    room = null;
    ws = null;
    Join = (roomName) => {
        this.room = roomName;
    }
    Leave = () => {
        this.room = null;
    }
    send = (message) => {
        this.ws.send(message);
    }
    ChangeUsername = (newUsername) => {
        this.username = newUsername;
    }
    constructor(username, room, ws) {
        this.username = username == null || username=="" ? "Anonymous" : username;
        this.room = room == null|| room=="" ? null : room;
        this.ws = ws;
    }
}
class Message {
    username = null;
    message = null;
    messageType = null;
    room = null;
    MessageFormatted = () => {
        return JSON.stringify({ username: this.username, message: this.message, messageType: this.messageType, room: this.room });
    }
    constructor(username, message, messageType, room) {
        this.username = username;
        this.message = message;
        this.messageType = messageType;
        this.room = room;
    }
}

module.exports = {
    User,
    Message
}
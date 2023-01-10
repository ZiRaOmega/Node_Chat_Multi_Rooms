const websocket = new WebSocket('ws://179.61.219.100:3001');

websocket.onmessage = function (event) {
    var username = document.cookie.split('=')[1];
    const data = JSON.parse(event.data);
    if (data.messageType == 'message') {
        
        var message = document.createElement('p');
        if (data.username == username) {
            message.classList.add('mine');
        } else if (data.username == 'Server') {
            message.classList.add('server');
        } else {
            message.classList.add('stranger');
        }
        message.classList.add('message');
        message.innerHTML = data.username + ': ' + data.message;
        document.getElementById('messages').appendChild(message);
       
    } else if (data.messageType == 'joined room') {
        
        var roomTitle = document.getElementById('roomNameText');
        roomTitle.innerHTML = data.room;
        var message = document.createElement('p');
        message.classList.add('joined');
        message.classList.add('message');
        message.innerHTML = data.username + ' has joined the room';
        document.getElementById('messages').appendChild(message);
    } else if (data.messageType == 'roomList') {
        
        var roomList = document.getElementById('roomList');
        //append data.message to roomList
        roomList.innerHTML = ''
        for (let i = 0; i < data.message.length; i++) {
            var option = document.createElement('option');
            option.value = data.message[i];

            roomList.appendChild(option)
        }
    }
    AutoScrollMessages();
}
document.addEventListener('DOMContentLoaded', function () {
    var username = prompt('What is your username?');
    document.cookie = 'username=' + username;
});
websocket.onopen = function (event) {
    console.log('connected');
    var username = document.cookie.split('=')[1];
    websocket.send(JSON.stringify({ username: username, messageType: 'username set' }));
}

var ChooseRoom = document.getElementById('ChooseRoom')
var suggestions = document.getElementById('suggestions')
var input = ""
//add suggestion to ChooseRoom while typing in CHooseRoom
ChooseRoom.onkeyup = function (e) {
    var roomList = document.getElementById('roomList');
    
    if (e.key == 'Backspace') {
        input = input.slice(0, -1)
        suggestions.innerHTML = ''
        var clickablesuggest = document.createElement('a')
        clickablesuggest.onclick = function () {
            ChooseRoom.value = clickablesuggest.innerText
            suggestions.innerHTML = ''
            JoinRoom(ChooseRoom.value)
            input = ''
            suggestions.innerHTML = ''
            ChooseRoom.value = ''
        }
        for (let i = 0; i < roomList.children.length; i++) {
            if (roomList.children[i].value.includes(input) && input != '') {
                clickablesuggest.innerText = roomList.children[i].value
                suggestions.appendChild(clickablesuggest)
            }
        }
    } else if (e.key == 'Enter') {
        JoinRoom(ChooseRoom.value)
        input = ''
        suggestions.innerHTML = ''
        ChooseRoom.value = ''

    } else {
        input += e.key
        suggestions.innerHTML = ''
        var clickablesuggest = document.createElement('a')
        clickablesuggest.onclick = function () {
            ChooseRoom.value = clickablesuggest.innerText
            suggestions.innerHTML = ''
            JoinRoom(ChooseRoom.value)
            input = ''
            suggestions.innerHTML = ''
            ChooseRoom.value = ''
        }
        for (let i = 0; i < roomList.children.length; i++) {
            if (roomList.children[i].value.includes(input) && input != '') {
                clickablesuggest.innerText = roomList.children[i].value
                suggestions.appendChild(clickablesuggest)
            }
        }
    }
    
}




var SendMessage = document.getElementById('sendMessage')
SendMessage.onclick = function () {
    var message = document.getElementById('message').value;
    if (message == '') {
        return;
    }
    var username = document.cookie.split('=')[1];
    websocket.send(JSON.stringify({ username: username, message: message, messageType: 'message' }));
    document.getElementById('message').value = '';
}
SendMessage.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        var message = document.getElementById('message').value;
        if (message == '') {
            return;
        }
        var username = document.cookie.split('=')[1];
        websocket.send(JSON.stringify({ username: username, message: message, messageType: 'message' }));
        document.getElementById('message').value = '';
    }
});

var LeaveRoom = document.getElementById('leaveroom-menu')
LeaveRoom.onclick = function () {
    var username = document.cookie.split('=')[1];
    websocket.send(JSON.stringify({ username: username, messageType: 'left room' }));
    CleanMessages();
}

const JoinRoom = (room) => {
    CleanMessages();
    var username = document.cookie.split('=')[1];
    websocket.send(JSON.stringify({ username: username, messageType: 'joined room', room: room }));
}
const CleanMessages = () => {
    var allMessages = document.getElementById('messages');
    allMessages.innerHTML = '';
}
document.addEventListener("keyup", function (event) {
    if (event.key =="Enter"){
        var message = document.getElementById('message').value;
        if (message == '') {
            return;
        }
        var username = document.cookie.split('=')[1];
        websocket.send(JSON.stringify({ username: username, message: message, messageType: 'message' }));
        document.getElementById('message').value = '';
    }});
const AutoScrollMessages = () => {
    var messages = document.getElementById('messages');
    messages.scrollTop = messages.scrollHeight;
}
    
/*
//Non-Obsfucated Code
const websocket = new WebSocket('ws://localhost:3001');

websocket.onmessage = function (event) {
    var username = document.cookie.split('=')[1];
    const data = JSON.parse(event.data);
    if (data.messageType == 'message') {
        
        var message = document.createElement('p');
        if (data.username == username) {
            message.classList.add('mine');
        } else if (data.username == 'Server') {
            message.classList.add('server');
        } else {
            message.classList.add('stranger');
        }
        message.classList.add('message');
        message.innerHTML = data.username + ': ' + data.message;
        document.getElementById('messages').appendChild(message);
    } else if (data.messageType == 'joined room') {
        
        var roomTitle = document.getElementById('roomNameText');
        roomTitle.innerHTML = data.room;
        var message = document.createElement('p');
        message.classList.add('joined');
        message.classList.add('message');
        message.innerHTML = data.username + ' has joined the room';
        document.getElementById('messages').appendChild(message);
    } else if (data.messageType == 'roomList') {
        
        var roomList = document.getElementById('roomList');
        //append data.message to roomList
        roomList.innerHTML = ''
        for (let i = 0; i < data.message.length; i++) {
            var option = document.createElement('option');
            option.value = data.message[i];

            roomList.appendChild(option)
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var username = prompt('What is your username?');
    document.cookie = 'username=' + username;
});
websocket.onopen = function (event) {
    console.log('connected');
    var username = document.cookie.split('=')[1];
    websocket.send(JSON.stringify({ username: username, messageType: 'username set' }));
}

var ChooseRoom = document.getElementById('ChooseRoom')
var suggestions = document.getElementById('suggestions')
var input = ""
//add suggestion to ChooseRoom while typing in CHooseRoom
ChooseRoom.onkeyup = function (e) {
    var roomList = document.getElementById('roomList');
    
    if (e.key == 'Backspace') {
        input = input.slice(0, -1)
        suggestions.innerHTML = ''
        var clickablesuggest = document.createElement('a')
        clickablesuggest.onclick = function () {
            ChooseRoom.value = clickablesuggest.innerText
            suggestions.innerHTML = ''
            JoinRoom(ChooseRoom.value)
            input = ''
            suggestions.innerHTML = ''
            ChooseRoom.value = ''
        }
        for (let i = 0; i < roomList.children.length; i++) {
            if (roomList.children[i].value.includes(input) && input != '') {
                clickablesuggest.innerText = roomList.children[i].value
                suggestions.appendChild(clickablesuggest)
            }
        }
    } else if (e.key == 'Enter') {
        JoinRoom(ChooseRoom.value)
        input = ''
        suggestions.innerHTML = ''
        ChooseRoom.value = ''

    } else {
        input += e.key
        suggestions.innerHTML = ''
        var clickablesuggest = document.createElement('a')
        clickablesuggest.onclick = function () {
            ChooseRoom.value = clickablesuggest.innerText
            suggestions.innerHTML = ''
            JoinRoom(ChooseRoom.value)
            input = ''
            suggestions.innerHTML = ''
            ChooseRoom.value = ''
        }
        for (let i = 0; i < roomList.children.length; i++) {
            if (roomList.children[i].value.includes(input) && input != '') {
                clickablesuggest.innerText = roomList.children[i].value
                suggestions.appendChild(clickablesuggest)
            }
        }
    }
    
}




var SendMessage = document.getElementById('sendMessage')
SendMessage.onclick = function () {
    var message = document.getElementById('message').value;
    if (message == '') {
        return;
    }
    var username = document.cookie.split('=')[1];
    websocket.send(JSON.stringify({ username: username, message: message, messageType: 'message' }));
    document.getElementById('message').value = '';
}
SendMessage.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        var message = document.getElementById('message').value;
        if (message == '') {
            return;
        }
        var username = document.cookie.split('=')[1];
        websocket.send(JSON.stringify({ username: username, message: message, messageType: 'message' }));
        document.getElementById('message').value = '';
    }
});

var LeaveRoom = document.getElementById('leaveroom-menu')
LeaveRoom.onclick = function () {
    var username = document.cookie.split('=')[1];
    websocket.send(JSON.stringify({ username: username, messageType: 'left room' }));
    CleanMessages();
}

const JoinRoom = (room) => {
    CleanMessages();
    var username = document.cookie.split('=')[1];
    websocket.send(JSON.stringify({ username: username, messageType: 'joined room', room: room }));
}
const CleanMessages = () => {
    var allMessages = document.getElementById('messages');
    allMessages.innerHTML = '';
}

*/
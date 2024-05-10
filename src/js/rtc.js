newMessageusers = [];

function establishConnection() {
    let socket = io('/stream');
    var socketId = '';

    reciever = document.getElementById('username').innerText;
    msg = document.getElementById('text-input').value;
    sender = me;
    input.value = '';

    socket.on('connect', () => {
        socketId = socket.io.engine.id;

        socket.emit('subscribe', {
            reciever: reciever,
            sender: sender,
            socketId: socketId
        });

        document.getElementById('SendBtn').addEventListener('click', (e) => {
            e.preventDefault();
            var msg = document.getElementById('text-input').value;
            socket.emit('chat', {
                msg: msg,
                reciever: reciever,
                sender: sender,
                type: 0
            });
            document.getElementById('text-input').value = '';
        });
        socket.on('chatback', (data) => {
            rateLimitedFunction(data.msg, data.sender, data.reciever);
        });
    });
}


function addChat(msg, sender, reciever) {
    current = document.getElementById('username').innerText;
    
    if (sender == current){
        
        if (msg instanceof ArrayBuffer) {
          
            const audioBlob = new Blob([new Uint8Array(msg)], { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            document.querySelector('.chatbox').innerHTML += `
            <div class='d-flex align-items-center text-start'>
            <span class='rcvmsg d-flex justify-content-center align-items-center'>
            <audio controls>
            <source src="${audioUrl}"  type="audio/webm">
            Your browser does not support the audio element.
            </audio>
            <div class='date2 mt-3'>${new Date().toLocaleTimeString()}</div>
            </span>
            </div>

            <div class='d-flex align-items-center text-start'>
            <span onclick="transcribeData('$')" class='rcvbtn d-flex justify-content-center align-items-center'>
            Transcribe</span>
            </div>
            `

                document.querySelector('.chatbox').scrollTo(0, document.querySelector('.chatbox').scrollHeight);
        } else{
        document.querySelector('.chatbox').innerHTML += `
        <div class='d-flex align-items-center text-start'>
        <span class='rcvmsg d-flex justify-content-center align-items-center'>
        <div class=' mx-3 '>${msg}</div>
        <div class='date2 mt-3'>${new Date().toLocaleTimeString()}</div>
        </div>
        </span>
        `
        }
    }
    
    else{
        newMessageUpdate(sender);
        chatlist = document.querySelectorAll('.chatlistitem');
        for (i = 0; i < chatlist.length; i++){
            if (chatlist[i].innerText == sender){
                chatlist[i].classList.add('newmsg');
                break;
            }
        }
    }
    document.querySelector('.chatbox').scrollTo(0, document.querySelector('.chatbox').scrollHeight);
}

function rateLimit(func, delay) {
    let lastExecution = 0;

    return function(...args) {
        const now = Date.now();
        if (now - lastExecution >= delay) {
            func.apply(this, args);
            lastExecution = now;
        }
    };
}

const rateLimitedFunction = rateLimit(addChat, 100);

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function newMessageUpdate(user) {
    if (!newMessageusers.includes(user)) {
        newMessageusers.push(user);
    }
}

fetchActiveUsers();
var me = getUrlParameter('username');

document.querySelectorAll(".hidden-true").forEach((element) => {
    element.hidden = true;
});

function updateUsers(users){

    if (!users.includes(me)) {
        window.location.href = 'index.html';
    }

    chatslistarea = document.querySelector('.chatslistarea');
    chatslistarea.innerHTML = '';
    for (let i = 0; i < users.length; i++) { 
        const element = users[i];
        if (element === me) {
            continue;
        }
        const div = document.createElement('div');
        if (element === document.getElementById('username').innerText) {
            div.classList.add('currentuser');    
        }

        div.classList.add('d-flex', 'align-items-center', 'border-bottom', 'chatlistitem');
        if (newMessageusers.includes(element)) {
            div.classList.add('newmsg');
        }
        div.innerHTML = `
            <img src='images/profile.png' class='profilepic' alt='user'>
            <h6 class='m-3'>${element}</h6>
            <span class='active'></span>
        `;
        div.addEventListener('click', () => {
            document.querySelectorAll(".hidden-true").forEach((e) => {
                e.hidden = false;
                document.querySelector('.chatbox').innerHTML = '';
                fetchChat(element, me);
            });

            if (div.classList.contains('newmsg')) {
                div.classList.remove('newmsg');
                newMessageusers = newMessageusers.filter(user => user !== element);
            }

            document.getElementById('username').innerText = element;
            
            establishConnection();
        });
        chatslistarea.appendChild(div);
    }   
}

input = document.getElementById('text-input');
// add Enter key event listener
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('SendBtn').click();
    }
});

function sendMessage() {
    const text = input.value;
    if (text === '') return;
    document.querySelector('.chatbox').innerHTML += `
        <div class='d-flex align-items-center text-end'>
            <span class='textmsg d-flex justify-content-center align-items-center'>
                <div class=' mx-3 '>${text}</div>
                <div class='date mt-3'>${new Date().toLocaleTimeString()}</div>
                </div>
            </span>
    `        
    document.querySelector('.chatbox').scrollTo(0, document.querySelector('.chatbox').scrollHeight);
}


function fetchActiveUsers() {
        fetch('/active-users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch active users');
            }
            return response.json();
        })
        .then(data => {
            updateUsers(data.activeUsers);
            })
        .catch(error => {
            console.error(error);
        });
    }
setInterval(fetchActiveUsers, 1000);

function fetchChat(receiver, sender) {
fetch('/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        sender: sender,
        receiver: receiver // Corrected key name
    })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to fetch chat');
    }
    return response.json();
})
.then(data => {
    const messages = data.messages;
    document.querySelector('.chatbox').innerHTML = '';
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (message.sender === sender) { // Check if the sender matches the receiver
            // check if blob
            if (message.type === 'audio') {
                // decode the audio data
                audio = new Uint8Array(message.chat);
                audio = new TextDecoder().decode(audio);
                const audioBlob = new Blob([new Uint8Array(audio)], { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                    document.querySelector('.chatbox').innerHTML += `
                    <div class='d-flex align-items-center text-end'>
                    <span class='textmsg d-flex justify-content-center align-items-center'>
                    <audio controls>
                    <source id="${message.chat}" type="audio/webm">
                    Your browser does not support the audio element.
                    </audio>
                    <div class='date mt-3'>${new Date(message.timestamp).toLocaleTimeString()}</div>
                    </span>
                    </div>

                    <div class='d-flex align-items-center text-end'>
                    <span onclick="transcribeData('${message.chat}')" class='textbtn d-flex justify-content-center align-items-center'>
                    Transcribe</span>
                    </div>
                    `;
                document.getElementById(message.chat).src = "/audiofile/" + message.chat + ".wav";


                    document.querySelector('.chatbox').scrollTo(0, document.querySelector('.chatbox').scrollHeight);
            } else{

                document.querySelector('.chatbox').innerHTML += `
                <div class='d-flex align-items-center text-end'>
                <span class='textmsg d-flex justify-content-center align-items-center'>
                <div class='mx-3'>${message.chat}</div>
                <div class='date mt-3'>${new Date(message.timestamp).toLocaleTimeString()}</div>
                </span>
                </div>
                `;
            }
        } else {
            if (message.type === 'audio') {
                audio = new Uint8Array(message.chat);
                audio = new TextDecoder().decode(audio);
                const audioBlob = new Blob([new Uint8Array(audio)], { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                    document.querySelector('.chatbox').innerHTML += `
                    <div class='d-flex align-items-center text-start'>
                    <span class='rcvmsg d-flex justify-content-center align-items-center'>
                    <audio controls>
                    <source id="${message.chat}" type="audio/webm">
                    Your browser does not support the audio element.
                    </audio>
                    <div class='date2 mt-3'>${new Date(message.timestamp).toLocaleTimeString()}</div>
                    </span>
                    </div>

                    <div class='d-flex align-items-center text-start'>
                    <span onclick="transcribeData('${message.chat}')" class='rcvbtn d-flex justify-content-center align-items-center'>
                    Transcribe</span>
                    </div>
                    `;
                    document.getElementById(message.chat).src = "/audiofile/" + message.chat + ".wav";

                    document.querySelector('.chatbox').scrollTo(0, document.querySelector('.chatbox').scrollHeight);
            } else{
            document.querySelector('.chatbox').innerHTML += `
                <div class='d-flex align-items-center text-start'>
                    <span class='rcvmsg d-flex justify-content-center align-items-center'>
                        <div class='mx-3'>${message.chat}</div>
                        <div class='date2 mt-3'>${new Date(message.timestamp).toLocaleTimeString()}</div>
                    </span>
                </div>
            `;
        }
    }
    document.querySelector('.chatbox').scrollTo(0, document.querySelector('.chatbox').scrollHeight);
    }
})
.catch(error => {
    console.error(error);
});
}

function transcribeData(id) {
    fetch('/transcribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to transcribe audio');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}
// Function to establish connection when "Make Connection" button is clicked
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

        // Event listener for sending chat message
        document.getElementById('SendBtn').addEventListener('click', (e) => {
            e.preventDefault();
            var msg = document.getElementById('text-input').value;

            // Emit 'chat' event only when the user sends a message
            socket.emit('chat', {
                msg: msg,
                reciever: reciever
            });

            // Clear input field after sending message
            document.getElementById('text-input').value = '';
        });

        // Event listener for receiving chat messages
        socket.on('chat', (data) => {
            addChat(data, 'remote');
        });
    });
}


function addChat(data, senderType) {
    console.log(data);
    document.querySelector('.chatbox').innerHTML += `
    <div class='d-flex align-items-center text-start'>
        <span class='rcvmsg d-flex justify-content-center align-items-center'>
            <div class=' mx-3 '>${data.msg}</div>
            <div class='date2 mt-3'>${new Date().toLocaleTimeString()}</div>
            </div>
        </span>
`

    document.querySelector('.chatbox').scrollTo(0, document.querySelector('.chatbox').scrollHeight);
}
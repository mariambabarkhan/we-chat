import h from './helpers.js';

window.addEventListener('load', () => {
    const room = h.getQString(location.href, 'room');
    const username = sessionStorage.getItem('username');

    console.log(room);
    console.log(username);

    if (!room) {
        document.querySelector('#room-create').attributes.removeNamedItem('hidden');
    }

    else if (!username) {
        document.querySelector('#username-set').attributes.removeNamedItem('hidden');
    }

    else {
        let commElem = document.getElementsByClassName('room-comm');

        for (let i = 0; i < commElem.length; i++) {
            commElem[i].attributes.removeNamedItem('hidden');
        }

        var pc = [];

        let socket = io('/stream');

        var socketId = '';

        socket.on('connect', () => {
            //set socketId
            socketId = socket.io.engine.id;


            socket.emit('subscribe', {
                room: room,
                socketId: socketId
            });

            socket.on('chat', (data) => {
                h.addChat(data, 'remote');
            });
        });

        function sendMsg(msg) {
            let data = {
                room: room,
                msg: msg,
                sender: username
            };

            //emit chat message
            socket.emit('chat', data);

            //add localchat
            h.addChat(data, 'local');
        }

        function init(createOffer, partnerName) {
            //add
            pc[partnerName].ontrack = (e) => {
                //create a new div for card
                let cardDiv = document.createElement('div');
                cardDiv.className = 'card card-sm';
                cardDiv.id = partnerName;
                cardDiv.appendChild(newVid);
            };
        }
        //Chat textarea
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.which === 13 && (e.target.value.trim())) {
                e.preventDefault();

                sendMsg(e.target.value);

                setTimeout(() => {
                    e.target.value = '';
                }, 50);
            }
        });
    }
});

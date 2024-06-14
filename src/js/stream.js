const saveMessage = require('./events.js');
import { inject } from '@vercel/analytics';
 
inject();
const stream = (socket) => {
    socket.on('subscribe', (data) => {
        socket.join(data.sender);
        socket.join(data.socketId);
    });

    socket.on('chat', (data) => {
        if (data.msg != '' & data.msg != null) {
            saveMessage(data.sender, data.reciever, data.msg, data.type);
            socket.to(data.reciever).emit('chatback', { reciever: data.reciever, msg: data.msg, sender: data.sender});
        }
    });

    socket.on('video', (data) => {
        socket.to(data.reciever).emit('videoback', { reciever: data.reciever, sender: data.sender });
    }
    );
};

module.exports = stream;

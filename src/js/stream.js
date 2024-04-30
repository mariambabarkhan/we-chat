const stream = (socket) => {
    socket.on('subscribe', (data) => {
        socket.join(data.sender);
        socket.join(data.socketId);
    });

    socket.on('chat', (data) => {
        socket.to(data.reciever).emit('chat', { reciever: data.reciever, msg: data.msg });
    });
};

module.exports = stream;

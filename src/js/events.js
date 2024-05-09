const fs = require('fs');

// Define the saveMessage function
function saveMessage(sender, receiver, message, type) {
    if (!fs.existsSync('messages.json')) {
        fs.writeFileSync('messages.json', '[]');
    }

    if (type == 1){
        audioId = Math.random().toString(36).substring(7);
        fs.writeFileSync('src/audio/'+audioId+'.wav', message);
        message = audioId;
    }
    const messageData = [sender, receiver, message, new Date().toISOString(), type];
    let messages = JSON.parse(fs.readFileSync('messages.json'));

    messages.push(messageData);
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
}

module.exports = saveMessage;

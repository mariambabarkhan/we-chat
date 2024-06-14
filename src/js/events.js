const fs = require('fs');
import { inject } from '@vercel/analytics';
 
inject();
// Define the saveMessage function
function saveMessage(sender, receiver, message, type) {
    if (!fs.existsSync('messages.json')) {
        fs.writeFileSync('messages.json', '[]');
    }

    if (!fs.existsSync('backup/backup.json')) {
        fs.writeFileSync('backup/backup.json', '[]');
    }
    
    if (type == 1){ 
        audioId = Math.random().toString(36).substring(7);
        fs.writeFileSync('src/audio/'+audioId+'.wav', message);
        message = audioId;
    }
    const messageData = [sender, receiver, message, new Date().toISOString(), type];
    let messages = JSON.parse(fs.readFileSync('messages.json'));
    let backup = JSON.parse(fs.readFileSync('backup/backup.json'));

    messages.push(messageData);
    backup.push(messageData);
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
    fs.writeFileSync('backup/backup.json', JSON.stringify(backup, null, 2));
}

module.exports = saveMessage;

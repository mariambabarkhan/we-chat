const fs = require('fs');

// Define the saveMessage function
function saveMessage(sender, receiver, message) {
    if (!fs.existsSync('messages.json')) {
        fs.writeFileSync('messages.json', '[]');
    }

    const messageData = [sender, receiver, message, new Date().toISOString()];
    let messages = JSON.parse(fs.readFileSync('messages.json'));

    messages.push(messageData);

    // Write updated messages array back to JSON file
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
}

// Export the saveMessage function
module.exports = saveMessage;

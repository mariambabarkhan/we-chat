let express = require( 'express' );
const fs = require('fs');
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './src/js/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );

let transcribe = require('./src/js/trans.js');
const { type } = require('os');

app.use('/audiofile', express.static('src/audio'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use( favicon( path.join( __dirname, './src/images/magic.png' ) ) );
app.use(express.static(__dirname + '/src'));

app.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/src/index.html' );
} );

io.of( '/stream' ).on( 'connection', stream );

server.listen( 3000 );
let activeUsers = [];

app.post('/submit-login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = {
        username: username,
        password: password
    };

    const response = checkUserInJSON(user);
    if (response.error) {
        res.status(400).send(response.error);
    }
    else {
        const socket = io.of('/stream').connected[req.body.socketId];
        if (socket) {
            socket.username = username;
        }
        
        updateUserStatusAndNotify(username, 'active');
        // redirect to options page with username
        res.status(200).send("Login successful");

    }

});


app.post('/submit-signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const user = {
        username: username,
        password: password,
        email: email,
        status: 'inactive'
    };

    const response = addUserToJSON(user);

    if (response.error) {
        res.status(400).send(response.error);
    } else {        
        res.status(200).send(response.success);
    }

});


function addUserToJSON(user) {
    // Check if Users.json file exists
    if (fs.existsSync('Users.json')) {
        // File exists, read contents
        const usersData = JSON.parse(fs.readFileSync('Users.json'));

        // Check if username already exists
        if (usersData[user.username]) {
            return { error: 'Username already exists' };
        } else {
            // Add user to existing data
            usersData[user.username] = user;
            fs.writeFileSync('Users.json', JSON.stringify(usersData));
            return { success: 'User added successfully' };
        }
    } else {
        const newUserObject = {
            [user.username]: user
        };
        fs.writeFileSync('Users.json', JSON.stringify(newUserObject));
        return { success: 'File created and user added successfully' };
    }
}




function checkUserInJSON(user) {
    if (fs.existsSync('Users.json')) {
        const usersData = JSON.parse(fs.readFileSync('Users.json'));

        if (usersData[user.username]) {
            if (usersData[user.username].password === user.password) {
                return { success: 'Login successful' };
            } else {
                return { error: 'Incorrect password' };
            }
        } else {
            return { error: 'User not found' };
        }
    } else {
        return { error: 'User not found' };
    }
}

function updateUserStatusAndNotify(username, status) {
    if (status === 'active') {
        if (!activeUsers.includes(username)){
            activeUsers.push(username);
        }
    } else {
        activeUsers = activeUsers.filter(user => user !== username);
    }

    let users = [];
    if (fs.existsSync('Users.json')) {
        users = JSON.parse(fs.readFileSync('Users.json'));
    }

    users[username].status = status;

    fs.writeFileSync('Users.json', JSON.stringify(users));
}

app.get('/active-users', (req, res) => {
    res.json({ activeUsers });
});

app.post('/update-user-status', (req, res) => {
    const { username, status } = req.body;

    updateUserStatusAndNotify(username, status);
    res.sendStatus(200);
});

function getChatHistory(sender, receiver) {
    // Read existing messages from JSON file
    if (fs.existsSync('messages.json')) {
        messages = JSON.parse(fs.readFileSync('messages.json'));
    }
    const chatHistory = messages.filter(message =>
        (message[0] === sender && message[1] === receiver) ||
        (message[0] === receiver && message[1] === sender)
    );

    // Sort chat history by timestamp
    chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Extract message content and timestamp, and return as a list
    const formattedChat = chatHistory.map(message => {
        if (message[4] == 0) {
            // Text message
            return {
                sender: message[0],
                chat: message[2],
                timestamp: message[3],
                type: 'text'
            };
        } else  { 

              return {
                sender: message[0],
                chat: message[2],
                timestamp: message[3],
                type: 'audio'
            };
            

            // Audio file
            const audioFilePath = path.join('src/audio/', message[2] + '.wav'); // Assuming audio files are stored in 'src/audio' folder with extension '.wav
            if (fs.existsSync(audioFilePath)) {
                // Read audio file content
                const audioContent = fs.readFileSync(audioFilePath, 'utf8'); // Assuming audio file content can be read as text
                return {
                    sender: message[0],
                    chat: audioContent,
                    type: 'audio',
                    timestamp: message[3]
                };
            } else {
                // Audio file not found
                return {
                    sender: message[0],
                    chat: 'Audio file not found',
                    type: 'audio',
                    timestamp: message[3]
                };
            }
        }
    });
    return formattedChat;
}

app.post('/chat', (req, res) => {
    const { sender, receiver } = req.body;
    const messages = getChatHistory(sender, receiver);
    res.json({ messages });
});

 
app.post('/transcribe', (req, res) => {

    // incoming message.chat is buffer object
    const filePath = 'audio.wav';
    saveBufferToWav(req.body.audio, 44100, 1, 16, filePath);


    data = transcribe(req.body.audio);
    console.log(data);
    res.send(data);
});




function generateWavHeader(sampleRate, numChannels, bitsPerSample, dataLength) {
    const header = Buffer.alloc(44);
  
    // RIFF chunk descriptor
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4); // File size - 8 (36 bytes for format)
    header.write('WAVE', 8);

    // Format chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Length of format chunk (16 bytes)
    header.writeUInt16LE(1, 20); // PCM format
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // Byte rate
    header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // Block align
    header.writeUInt16LE(bitsPerSample, 34);

    // Data chunk
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40); // Data length

    return header;
}

function saveBufferToWav(bufferArray, sampleRate, numChannels, bitsPerSample, filePath) {
    const dataLength = bufferArray.length;
    const header = generateWavHeader(sampleRate, numChannels, bitsPerSample, dataLength);
    const wavBuffer = Buffer.concat([header, bufferArray]);

    fs.writeFileSync(filePath, wavBuffer);
}

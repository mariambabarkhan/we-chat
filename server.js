let express = require( 'express' );
const fs = require('fs');
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './src/js/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );

// let transcribe = require('./src/js/trans.js');
const { type } = require('os');

app.use('/audiofile', express.static('src/audio'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use( favicon( path.join( __dirname, './src/images/magic.png' ) ) );
app.use(express.static(__dirname + '/src'));
app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname,"src","index.html"))
});

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
        }
    });
    return formattedChat;
}

app.post('/chat', (req, res) => {
    const { sender, receiver } = req.body;
    const messages = getChatHistory(sender, receiver);
    if (messages.length === 0) {
        res.json({ error: 'No chat history found' });
    }
    res.json({ messages });
});

app.post('/addTranscribe', (req, res) => {
    let givenSender = req.body.sender;
    let givenReceiver = req.body.receiver;
    let transcript = req.body.transcript;
    
    let msgs = JSON.parse(fs.readFileSync('messages.json'));
    let latestTimestamp = msgs[0][3];

    msgs.forEach(msg => {
        const sender = msg[0];    // Assuming the sender is at index 1
        const receiver = msg[1];  // Assuming the receiver is at index 2
        const timestamp = msg[3]; // Assuming the timestamp is at index 3

        
        // Check if the current message is between the given sender and receiver
        if (sender === givenSender && receiver === givenReceiver) {
            
            if (timestamp > latestTimestamp) {
                console.log(timestamp, sender, receiver);
                latestTimestamp = timestamp;
                latestMsg = msg;
            }
        }
    });

    latestMsg.push(transcript);
    fs.writeFileSync('messages.json', JSON.stringify(msgs));
    res.json({success: 'Transcript added successfully'});
});

app.post('/transcribe', (req, res) => {

    id = req.body.id;
    msgs = JSON.parse(fs.readFileSync('messages.json'));

    let audioMsg = msgs.filter(msg => msg[2] == id);
    transcript = audioMsg[0][5]
    res.json({transcript: transcript});

});


let videoCallNotifications = [];

app.post('/send-video-notification', (req, res) => {
    const receiver  = req.body.receiver;
    const sender = req.body.sender;
    // push sender and receiver to videoCallNotifications
    videoCallNotifications.push({sender, receiver});

    // for 20 seconds, check if the receiver has accepted the call by checking notifications
    // if the receiver has not accepted the call, remove the notification

    setTimeout(() => {
        // check if notification is removed
        let notificationExists = false;
        for (let i = 0; i < videoCallNotifications.length; i++) {
            if (videoCallNotifications[i].sender === sender && videoCallNotifications[i].receiver === receiver) {
                notificationExists = true;
            }
        }
        if (!notificationExists) {
            res.status(400).send('Call rejected');
        }
        
    }, 1000);

    setTimeout(() => {
        for (let i = 0; i < videoCallNotifications.length; i++) {
            if (videoCallNotifications[i].sender === sender && videoCallNotifications[i].receiver === receiver) {
                videoCallNotifications = videoCallNotifications.filter(item => item !== videoCallNotifications[i]);
            }
        }
    }, 10000);

    res.sendStatus(200);
});

// Route to check for video call notifications
app.get('/check-video-notifications', (req, res) => {
    const receiver = req.query.receiver;
    for (let i = 0; i < videoCallNotifications.length; i++) {
        if (videoCallNotifications.length > 0 && videoCallNotifications[i].receiver === receiver) {
            res.json({ notification: true , sender: videoCallNotifications[i].sender, receiver: receiver});
            // Remove the notification after it's been retrieved
            videoCallNotifications = videoCallNotifications.filter(item => item !== receiver);
        }
    }
    res.json({ notification: false , sender: null, receiver: null});
});


app.post('/reject-call', (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    
    for (let i = 0; i < videoCallNotifications.length; i++) {
        if (videoCallNotifications[i].sender === sender && videoCallNotifications[i].receiver === receiver) {
            videoCallNotifications = videoCallNotifications.filter(item => item !== videoCallNotifications[i]);
        }
    }

    res.sendStatus(200);
});
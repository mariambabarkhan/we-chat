let mediaRecorder; // Global variable to hold the MediaRecorder instance
let recordedChunks = []; // Array to store recorded audio chunks
let isRecording = false; // Variable to track recording state

function startRecording() {
    // Check if MediaRecorder is supported by the browser
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('MediaRecorder is not supported by your browser.');
        return;
    }

    if (!isRecording) {
        // Define constraints for media stream (audio only)
        const constraints = { audio: true };

        // Request permission to access the user's microphone
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                // Create a new MediaRecorder instance with the stream
                mediaRecorder = new MediaRecorder(stream);

                // Event handler for dataavailable event
                mediaRecorder.ondataavailable = event => {
                    recordedChunks.push(event.data); // Store recorded audio chunks
                };

                // Event handler for stop event
                mediaRecorder.onstop = () => {
                    // Combine recorded chunks into a single Blob
                    const recordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                    // Reset recordedChunks array
                    recordedChunks = [];

                    console.log('Recorded Blob:', recordedBlob);
                    // Handle the recorded audio Blob (e.g., send to server)
                    handleRecordedAudio(recordedBlob);
                    
                    // write audio msg to chat
                    const audioUrl = URL.createObjectURL(recordedBlob);
                    document.querySelector('.chatbox').innerHTML += `
                        <div class='d-flex align-items-center text-end'>
                            <span class='textmsg d-flex justify-content-center align-items-center'>
                                <audio controls>
                                    <source src="${audioUrl}" type="audio/webm">
                                    Your browser does not support the audio element.
                                </audio>
                                <div class='date mt-3'>${new Date().toLocaleTimeString()}</div>
                            </span>
                        </div>
                    `;
                    document.querySelector('.chatbox').scrollTo(0, document.querySelector('.chatbox').scrollHeight);

                };

                // Start recording
                mediaRecorder.start();
                isRecording = true;
            })
            .catch(error => {
                console.error('Error accessing user media:', error);
            });
    } else {
        stopRecording();
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        isRecording = false;
        mediaRecorder.stream.getTracks().forEach(track => track.stop()); // Release the microphone stream
        mediaRecorder = null; // Release the MediaRecorder instance
    }
}

function handleRecordedAudio(blob) {
    socket = io('/stream');
    socket.emit('chat', {
        msg: blob,
        reciever: reciever,
        sender: sender
    });
}
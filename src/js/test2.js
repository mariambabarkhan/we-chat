
function transcribeAudio(ID) {
    src = document.getElementById(ID).src;    

    const recognizer = new window.webkitSpeechRecognition();
    recognizer.lang = 'en-US';

    recognizer.onresult = function(event) {
        const transcriptionResult = event.results[0][0].transcript;
        document.getElementById('transcriptionResult').innerText = transcriptionResult;
    }

    recognizer.onerror = function(event) {
        console.error('Error occurred during transcription:', event.error);
    }

    const audioBlob = new Blob([audioFile], { type: 'audio/wav' });
    const audioURL = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioURL);
    audio.then(() => {
        recognizer.start();
    }).catch(error => {
        console.error('Error occurred while playing audio:', error);
    });
}

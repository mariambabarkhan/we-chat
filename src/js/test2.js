function transcribeAudio(ID){
    audiosrc = document.getElementById(ID).src;

    // using webkitSpeechRecognition
    var recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = function(event) {
        document.getElementById("transcript").value = event.results[0][0].transcript;
    }

    recognition.start();
}
const express = require("express");
const app = express();
const textToSpeech = require("@google-cloud/text-to-speech");
const speech = require('@google-cloud/speech');

// Import other required libraries
const fs = require("fs");
const util = require("util");

// Creates a client
const tssClient = new textToSpeech.TextToSpeechClient();
const sttClient = new speech.SpeechClient();


async function ttsRequest(msg) {
    // The text to synthesize
    const text = msg;

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: "th-TH", ssmlGender: "FEMALE" },
        // select the type of audio encoding
        audioConfig: { audioEncoding: "MP3" },
    };

    // Performs the text-to-speech request
    const [response] = await tssClient.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile("output.mp3", response.audioContent, "binary");
    console.log("Audio content written to file: output.mp3");
}

async function sttRequest() {
    // The path to the remote LINEAR16 file
    const gcsUri = "gs://cloud-samples-data/speech/brooklyn_bridge.raw";

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        uri: gcsUri,
    };
    const config = {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await sttClient.recognize(request);
    const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");
    console.log(`Transcription: ${transcription}`);
}

app.get("/gtts", function (req, res) {
    ttsRequest("ทดลองการสร้างข้อความภาษาไทยด้วย Google Text-to-Speech");
});

app.get("/gstt", function (req, res) {
    sttRequest();
});


app.listen(3002, function () {
    console.log("Server is listening on Port 3002 at http://localhost:3002");
});

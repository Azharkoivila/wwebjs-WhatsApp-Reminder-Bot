
const { AssemblyAI } = require("assemblyai");

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLY_API,
});



async function Transcriptior(stream) {
    const params = {
        audio: stream,
        speech_model: "slam-1",
    };
    try {
        const transcript = await client.transcripts.transcribe(params);

        if (transcript.status === "error") {
            console.error(`Transcription failed: ${transcript.error}`);
            process.exit(1);
        }
        return transcript.text;

    } catch (error) {
        console.log(error)
    }
}


module.exports = Transcriptior;


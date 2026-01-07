import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { parentPort } from "worker_threads";
import pkg from "./fixedMidiPlayerJS/index.js";
const midiPlayerJS = pkg;

let events = [
	"note on",
	"note off"
];

const midiPlayer = new midiPlayerJS.Player();
midiPlayer.on("midiEvent", async (event) => {
	if (event.name == "Set Tempo") {
		midiPlayer.setTempo(event.data);
		return;
	} else if (events.includes(event.name.toLowerCase())) {
		parentPort.postMessage({"head":"event", "event": event});
	}
});

parentPort.on("message", async message => {
	if (message.head == "tempo") {
		midiPlayer.pause();
		midiPlayer.setTempo(message.tempo);
		midiPlayer.play();
	}
	if (message.head == "play") {
		let item = message.item || undefined;
		try {
			midiPlayer.loadFile(`${__dirname}/midi/${item.file}`);
			midiPlayer.play();
		} catch (error) {
			console.log("midi error:"+error);
			parentPort.postMessage({"head": "error"});
			parentPort.postMessage({"head": "end"});
		}
	}
	if (message.head == "stop") {
		midiPlayer.stop();
	}
});

midiPlayer.on("endOfFile", () => {
	parentPort.postMessage({"head": "end"});
});
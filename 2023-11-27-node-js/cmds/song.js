// callum fisher - 2023.12.22

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
import path from "path";
import {
	fileURLToPath
} from 'url';
import editJsonFile from "edit-json-file";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const moduleName = "play";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "song",
	category: "songs",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Displays the currently playing song."
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	let input = args.input.toLowerCase();
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let MIDI = await runEval(`song`);
	if (!input) {
		if (MIDI.playing && MIDI.current.recording) {
			sendChat("Playing a user recording.");
			stop();
		} else {
			if (MIDI.current.file && MIDI.playing) {
				let songs = editJsonFile(`${__dirname}/../songs.json`).data.index;
				sendChat(`Playing #${MIDI.current.id || "unknown"} - ${songs[MIDI.current.id].name || "unknown"}`);
				stop();
			} else {
				sendChat(rando([
					"No song.",
					"The sound of silence.",
					"I'm not playing anything right now."
				]));
				stop();
			}
		}
	} else {
		stop();
	}
}

parentPort.on("message", (msg) => {
	if (msg.head == "run") {
		try {
			run(msg.body);
		} catch (error) {
			parentPort.postMessage({"head": "error"});
			addToLog(moduleName, error);
		}
	}
	if (msg.head == "info") {
		parentPort.postMessage({"head": "info", "body": info});
	}
	if (msg.head == "stop") {
		setTimeout(() => {
			process.exit();
		}, 1000);
	}
});

function stop () {
	parentPort.postMessage({"head": "stop"});
}

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};

async function runEval (input) {
	return new Promise((resolve, reject) => {
		parentPort.on('message', (message) => {
			if (message.head == "eval") {
				let res = message.body;
				if (res !== undefined) res = JSON.parse(res); 
				resolve(res);
			}
		});
		parentPort.postMessage({"head": "eval", "body": JSON.stringify(input)});
	});
}
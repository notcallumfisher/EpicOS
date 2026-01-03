// callum fisher - 2024.01.13

import database from "../db.js";
const { registered, register, get, getInventory, hasItem, giveItem, takeItem } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort, Worker } from "worker_threads";
import stringSimilarity from "string-similarity";
import fs from "fs";
import path from "path";
import {
	fileURLToPath
} from 'url';
import editJsonFile from "edit-json-file";
import validator from "validator";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = "play";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "play",
	category: "Songs",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Allows you to request a song."
}

info.usage = `%cmdprefix%${info.name} <Song ID or Name>`;

async function run (args) {
	let cmdPrefix = args.cmdPrefix;
	let msg = args.msg;
	let input = args.input.toLowerCase();
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let _id = msg.p._id;
	let MIDI = await runEval(`song`);
	let queue = MIDI.queue;
	let alreadyQueued = false;
	let queueItem;
	let queueFiles = [];
	queue.forEach(item => {
		queueFiles.push(item.file)
		if (item.request) {
			if (item.by._id == _id) alreadyQueued = true;
			queueItem = queue.indexOf(item);
		}
	});
	if (!registered(_id)) register(_id, msg.p.name);
	if (!hasItem("coin", _id)) {
		sendChat(`It looks like DJ ${msg.p.name} doesn't have any coins to ${cmdPrefix}play a song with.`);
		stop();
		return;
	}
	if ((getInventory(msg.p._id)["coin"].amount - 1 < 0)) {
		sendChat(rando([
			`It looks like DJ ${msg.p.name} doesn't have enough coins to ${cmdPrefix}play a song with.`,
			`DJ ${msg.p.name} stares intently at the jukebox, but it doesn't respond.`
		]));
		stop();
		return;
	}
	if (!input) {
		let songs = editJsonFile(`${__dirname}/../songs.json`).data.index;
		sendChat(`What would you like to play?${MIDI.playing ? " Currently playing #"+MIDI.current.id+" - "+songs[MIDI.current.id].name : ""} (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
		stop();
	} else if (queue.length >= 4 && !alreadyQueued) {
		sendChat("The song queue is at max capacity.");
		stop();
	} else {
		let rank = get("rank", _id);
		let bypassQueue = rank >= 2 && input.includes("bypass");
		input = input.split("bypass")[0].trim();
		let files = [];
		fs.readdirSync(`${__dirname}/../midi`).forEach(file => {
			if (file.toLowerCase().includes(".mid")) {
				files.push(file);
			}
		});

		let songs = editJsonFile(`${__dirname}/../songs.json`);

		// handle text search:
		let results = stringSimilarity.findBestMatch(input, songs.data.index.map((file) => file.name));
		let result = results.bestMatch;
		let resultIndex = results.bestMatchIndex;
		let name = result.target
		let id = resultIndex;
  		let hash = songs.data.index[id].hash;
		let giveHashHint;

		if (input.includes("#")) if (!isNaN(input.split("#")[1].trim())) giveHashHint = true;

		// handle id search:
		if (!isNaN(input)) {
			if (songs.data.index[input]) {
				name = songs.data.index[input].name;
				id = input;
				hash = songs.data.index[id].hash;
			} else {
				id = null;
			}
		}
		
		// check deletion status:
		if (songs.data.index[id]) {
			if (songs.data.index[id].deleted) {
				sendChat(`Sorry, #${id} - ${name} has been deleted.`);
				stop();
				return;
			}
		}
		
		let file = `${id}.mid`; // stringSimilarity.findBestMatch(JSON.stringify(songNames.indexOf(songName)), files).bestMatch.target; // find best match will correct mid/midi extensions (hopefully) old: id + ".mid"
		if (queueFiles.includes(file) || MIDI.current.file == file && MIDI.playing) {
			sendChat(`#${id} is already ${MIDI.current.file == file ? "playing" : "in the queue"}.`);
			stop();
		} else if (!songs.data.index[id]) {
			sendChat("Well, I couldn't find that one anywhere.");
			stop();
		} else {
			let what = `${alreadyQueued ? "Changing your queued song to" : "Queuing"}`;
			sendChat(`${bypassQueue ? "Playing" : what} #${id} - ${name}${isNaN(input) && !name.toLowerCase().includes(input) ? " (best match)" : ""}${giveHashHint ? " - Psst..! The # isn't required for song IDs." : "."}${!alreadyQueued ? " [-1 coin]" : ""}`);
			if (!alreadyQueued) takeItem("coin", _id, 1);
			if (!alreadyQueued) {
				if (!await runEval(`song.current.request`)) await runEval(`resetMIDIData()`);
				if (!bypassQueue) {
					let newItem = {"file": file, "id": id, "request": true, "by": {"_id": _id, "name": name}};
					await runEval(`song.queue.push(${JSON.stringify(newItem)})`);
					console.log(`song.queue.push(${JSON.stringify(newItem)})`);
					stop();
				} else {
					await runEval(`playMIDI({"file":"${file}", "id": "${id}", "request": true, "by": {"_id": "${_id}", "name": "${msg.p.name}"}})`);
					stop();
				}
			} else {
				let newQueueItem = queue[queueItem];
				newQueueItem.file = file;
				let index = queue.findIndex(item => item.request ? item.by : false);
				await runEval(`song.queue[${index}] = ${JSON.stringify(newQueueItem)}`);
				stop();
			}
		}
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

const stop = () => {
	parentPort.postMessage({"head": "stop"});
}

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
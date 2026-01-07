// callum fisher - 2024.01.11

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "stop";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "stop",
	category: "songs",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Allows you to stop songs."
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	let cmdPrefix = args.cmdPrefix;
	let msg = args.msg;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let name = msg.p.name;
	let _id = msg.p._id;
	/* let queue = await runEval(`song.queue`);
	let alreadyQueued = false;
	let queueItem;
	queue.forEach(item => {
		if (item.request) {
			if (item.by._id == _id) alreadyQueued = true;
			queueItem = queue.indexOf(item);
		}
	}); */
	let MIDI = await runEval("song");
	/*if (alreadyQueued) {
		let newQueue = queue;
		newQueue.pop(queueItem);
		let string = "Removed your song from the queue.";
		if (MIDI.current.request) {
			if (MIDI.current.by._id == _id) {
				string += ` You can send ${cmdPrefix}${info.name} again to stop this song.`;
			}
		}
		sendChat(string);
		await runEval(`song.queue = ${JSON.stringify(newQueue)}`);
		stop();
	} else */ if (!MIDI.playing) {
		sendChat(`${name}, I'm not playing a song right now.`);
		stop();
	} else if (MIDI.current.request) {
		if (MIDI.current.by._id !== _id) {
			// sendChat(`${name}, you didn't request this song, ${MIDI.current.by.name} ${name == MIDI.current.by.name ? " ("+MIDI.current.by._id+")": ""} did.`);
			if (!MIDI.current.skipVotes) await runEval(`song.current.skipVotes=[]`);
			let votes = await runEval("song.current.skipVotes");
			let ppl = await runEval("bot.client.ppl");
			ppl = Object.keys(ppl).filter(user => ppl[user].tag ? ppl[user].tag.text !== "BOT" : true).length;
			let requiredVotes = Math.ceil(ppl / 2); // at least half of the people need to vote
			if (ppl < 3) requiredVotes = 2;
			if (!votes.includes(_id)) {
				await runEval(`song.current.skipVotes.push("${_id}")`);
				sendChat(`${name} has voted to ${cmdPrefix}stop #${MIDI.current.id}. (${votes.length+1}/${requiredVotes}).`);
			} else {
				sendChat(`${name}, you already voted to ${cmdPrefix}stop #${MIDI.current.id}.`)
			}
			if (votes.length + 1 >= requiredVotes) await runEval("resetMIDIData()");
			stop();
		} else {
			await runEval("resetMIDIData()");
			stop();
		}
	} else {
		await runEval("resetMIDIData()");
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
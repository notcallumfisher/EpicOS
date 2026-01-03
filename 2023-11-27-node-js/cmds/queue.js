// callum fisher - 2024.01.02

import database from "../db.js";
const { registered, register, get } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
import stringSimilarity from "string-similarity";
import fs from "fs";
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
	name: "play",
	category: "Songs",
	on: true,
	hidden: true,
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
	let queueString = '';
	queue.forEach(item => {
		queueString += item.file + ' - ';
	});
	sendChat("(test) "+queueString)
	stop();
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
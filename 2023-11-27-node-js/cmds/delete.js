// callum fisher - 2023.12.28

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import editJsonFile from "edit-json-file";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = "rename";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "delete",
	category: "songs",
	on: true,
	hidden: false,
	wip: false,
	rank: 2,
	description: "Allows you to delete a song."
}

info.usage = `%cmdprefix%${info.name} <Song ID>`;

async function run (args) {
	let cmdPrefix = args.cmdPrefix;
	let msg = args.msg;
	let input = args.input.split(" ")[0];
	let qMsg = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	if (!input || isNaN(input)) {
		qMsg(`Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)}`);
		stop();
	} else {
		let songs = editJsonFile(`${__dirname}/../songs.json`);
		if (!songs.data.index[input]) {
			qMsg("No such song.");
			stop();
		} else {
			await runEval(`deleteMIDI(${input})`);
			qMsg(`Done.`);
			stop();
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
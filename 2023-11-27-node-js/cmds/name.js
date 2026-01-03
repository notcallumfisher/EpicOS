// callum fisher - 2024.01.04

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "contrometer";

setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "name",
	category: "Main",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Allows you to set the name of the bot for a while."
}

info.usage = `%cmdprefix%${info.name} <Name>`;

async function run (args) {
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let qMsg = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg, bypass: true }});
	}
	if (!input) {
		qMsg(`Give me a name! (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
		stop();
	} else {
		await runEval(`nameQueue.push("${input}")`);
		qMsg("Okay, I've added that name to the name queue.");
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
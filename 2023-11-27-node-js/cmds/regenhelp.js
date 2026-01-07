// callum fisher - 2023.12.20

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "regenhelp";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "regenhelp",
	category: "Tools",
	on: true,
	hidden: false,
	wip: false,
	rank: 2,
	description: "Allows you to reload the command help information."
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	await runEval("generateHelpList()");
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
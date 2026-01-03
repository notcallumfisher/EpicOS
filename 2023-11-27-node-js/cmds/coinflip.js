// callum fisher - 2023.12.26

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "coinflip";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "coinflip",
	category: "Arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Flip a coin."
}

info.usage = `%cmdprefix%${info.name}`;

function run (args) {
	const qMsg = msg => {
		parentPort.postMessage({"head": "say", "body": { msg: msg, bypass: true }});
	}
	qMsg(Math.random() > 0.5 ? "Tails." : "Heads.");
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
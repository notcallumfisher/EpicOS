// callum fisher - 2023.11.27

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "bunny";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "bunny",
	category: "text",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Hop on over."
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	const qMsg = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	qMsg('..(\ /)');
	qMsg('..(•.•)');
	qMsg('c(")(")');
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
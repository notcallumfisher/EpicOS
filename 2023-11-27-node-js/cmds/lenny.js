// callum fisher - 2023.12.22

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "lenny";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "lenny",
	category: "text",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "( ͡° ͜ʖ ͡°)"
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	sendChat(Math.random() < 0.2 ? "( ͡° ͜ʖ ͡°( ͡° ͜ʖ ͡°( ͡° ͜ʖ ͡°( ͡° ͜ʖ ͡°)͡° ͜ʖ ͡°) ͡° ͜ʖ ͡°)͡° ͜ʖ ͡°)" : "( ͡° ͜ʖ ͡°)");
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
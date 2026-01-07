// callum fisher - 2023.11.27

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "underline";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "underline",
	category: "Text",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Underlines your input!"
}

info.usage = `%cmdprefix%${info.name} <text>`;

async function run (args) {
	let msg = args.msg;
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	if (input) {
		sendChat(underline(input));
	} else {
		sendChat(`Please input something for me to underline. (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
	}
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

function underline (n) {
	for (var r="",e=0;e<n.length;e++) {
		r+=n[e]+"̲";
	}
	return r;
}
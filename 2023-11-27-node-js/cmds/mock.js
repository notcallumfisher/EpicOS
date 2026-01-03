// callum fisher - 2024.01.03

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "zalgo";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "mock",
	category: "Text",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Mocks your input!"
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
		sendChat(`${rando(["Ooooh!", "Ah,", "", "oH nOO!1"])} ${tumblr(input)}${rando(["!!", "!!!!!", ""])}`);
	} else {
		sendChat(`oOoOh! WhAT sHoUlD I mOcK? (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
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

function tumblr(stringystring) { // originally written by Squid
	if (typeof stringystring !== "string") {
		throw "SyntaxError: tumblr() may only be used with strings.";
	} else {
		var results = [];
		var csto = stringystring.toLowerCase();
		var csm = csto.split(' ');
		for (var i = 0; i < csm.length; i++) {
			var res2 = [];
			let wordc = csm[i].split('');
			for (var x = 0; x < wordc.length; x++) {
				if (x % 2 == 0) {
					res2.push(wordc[x].toUpperCase());
				} else {
					res2.push(wordc[x]);
				}
			}
		results.push(res2.join(''));
		}
		let fnl = results.join(' ');
		return fnl;
	}
}

const rando = array => {
	return Array.isArray(array) || (array = Array.from(arguments)), array[Math.floor(Math.random() * array.length)];
} // from Fishing
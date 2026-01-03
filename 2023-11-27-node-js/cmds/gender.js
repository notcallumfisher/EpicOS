// callum fisher - 2023.11.27

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
import getJSON from "get-json";

const moduleName = "gender";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "gender",
	category: "arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Determines whether names are associated more with males or females."
}

info.usage = `%cmdprefix%${info.name} <name>`;

async function run (args) {
	let msg = args.msg;
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	if (!input) {
		sendChat(`Give me a name! (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
	} else {
		getJSON("https://gender-api.com/get?name="+input.replace(/[^a-zA-Z0-9-_]/g, '')+"&key=redacted", function(error, data){
			if (error || (data.errno && (data.errno == 30 || data.errno == 40))){
				sendChat("My apologies, but this command has been overused. Try it again next century.");
				stop();
			} else if (data.gender == "unknown") {
				sendChat(`${input} is unknown. ${rando(["Huh.", "How mysterious.", ""])}`);
				stop();
			} else {
				sendChat(data.name_sanitized+" is "+data.accuracy+"% "+data.gender+".");
				stop();
			}
		})
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

function rando(r){return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};

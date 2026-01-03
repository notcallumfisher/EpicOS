// callum fisher - 2023.12.20

import database from "../db.js";
const { registered, register, set } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "ban";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "ban",
	category: "Tools",
	on: true,
	hidden: false,
	wip: false,
	rank: 2,
	description: "Ban users."
}

info.usage = `%cmdprefix%${info.name} <User _ID>`;

async function run (args) {
	let msg = args.msg;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let cmdPrefix = args.cmdPrefix;
	let name = msg.p.name;
	let _id = msg.p._id;
	if (!input) {
		sendChat(`Who do you want to ban? (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)}${info.name})`);
		stop();
	} else {
		if (!registered(input)) register(input, "Anonymous");
		set("banned", true, input);
		let crown = await runEval("bot.client.channel.crown");
		if (crown) {
			if (crown.userId == await runEval("bot.client.getOwnParticipant()._id")) {
				await runEval(`bot.client.sendArray([{m: "kickban", "_id": "${input}", "ms": 3600000}])`);
			}
		}
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

function pluralize (count, noun, breaker) {
	return `${count == 0 ? 'no' : String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${breaker ? ' ' + breaker + ' ' : ''} ${noun}${count !== 1 ? "s" : ''}`;
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
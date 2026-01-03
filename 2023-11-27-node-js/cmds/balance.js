// callum fisher - 2024.4.22

import database from "../db.js";
const { registered, register, hasItem, getInventory } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "balance";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "balance",
	category: "bank",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Displays your balance. Don't let it slip."
}

info.usage = `%cmdprefix%${info.name}`;

function run (args) {
	let msg = args.msg;
	// let cmdPrefix = args.cmdPrefix;
	// let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let _id = msg.p._id;
	if (!registered(_id)) register(_id, msg.p.name);
	if (hasItem("coin", _id)) {
		sendChat(`${msg.p.name}, you have a total of ${pluralize(getInventory(_id)["coin"].amount, "coin")}.`);
		stop();
	} else {
		sendChat(`${msg.p.name}, you have no coins.`);
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
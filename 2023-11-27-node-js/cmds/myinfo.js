// callum fisher - 2023.12.06

import database from "../db.js";
const { registered, register, hasItem, getInventory, get } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "myinfo";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "myinfo",
	category: "Main",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Displays your user information."
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
	let name = msg.p.name;
	let coinString;
	if (!registered(_id)) register(_id, msg.p.name);
	if (hasItem("coin", _id)) {
		coinString = `You have a total of ${pluralize(getInventory(_id)["coin"].amount, "coin")}`;
	} else {
		coinString = `You have no coins`;
	}
	sendChat(`\u{1F50E} ${rando(["Hello - According to extensive research:", "According to extensive research:", "Here's what I found:", "Here:", "Okay -"])} Your name is ${name}. Your _id is ${_id}. Your rank is ${get("rank", _id)}. ${coinString}.`);
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

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]}; // from Fishing

function pluralize (count, noun, breaker) {
	return `${count == 0 ? 'no' : String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${breaker ? ' ' + breaker + ' ' : ''} ${noun}${count !== 1 ? "s" : ''}`;
}
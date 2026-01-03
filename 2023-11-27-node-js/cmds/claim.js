// callum fisher - 2024.01.05

import database from "../db.js";
const { registered, register, hasItem, getInventory, giveItem, takeItem, get, set } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "invent";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "claim",
	category: "arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Claim a regular coin allowance."
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	let msg = args.msg;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let name = msg.p.name;
	let _id = msg.p._id;
	let date = Date.now();
	if (!registered(_id)) register(msg.p._id, name);
	let lastClaim = get("lastClaim", _id);
	if (!lastClaim) set("lastClaim", date - 86400000, _id);
	if (date - lastClaim >= 86400000) {
		set("lastClaim", date, _id);
		giveItem("coin", _id, 100);
		sendChat(`${name} just claimed their weekly allowance of 100 coins.`);
	} else {
		sendChat(rando([
			"Have patience.",
			"It's not time yet.",
			"Some people have no patience."
		]));
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

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};
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

function titleCase(str) {
    let smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
    return str.split(' ').map(function(word, index, array) {
        if (index !== 0 && index !== array.length-1 && smallWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}
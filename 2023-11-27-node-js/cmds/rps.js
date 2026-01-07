// callum fisher - 2023.11.27

import database from "../db.js";
const { registered, register, hasItem, getInventory, giveItem, takeItem } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "rps";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "rps",
	category: "arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Plays rock-paper-scissors with you!"
}

info.usage = `%cmdprefix%${info.name} <Rock|Paper|Scissors>`;

async function run (args) {
	let msg = args.msg;
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let _id = msg.p._id;
	let index = ["rock", "paper", "scissors"].indexOf(input.toLowerCase());
	if (index != -1) {
		let array = ["🗿 Rock!", "📝 Paper!", "✂️ Scissors!"];
		let choice = Math.floor(Math.random()*array.length);
		let giveBonus = Math.random() < 0.05 ? true : false;
		let win = false;
		switch (index) {
			case 0:
				switch (choice) {
					case 0: sendChat(array[choice] + " It's a tie!"); win = true; break;
					case 1: sendChat(array[choice] + " I won!"); break;
					case 2: sendChat(array[choice] + " You won!"); win = true; break;
				}
				break;
			case 1:
				switch (choice) {
					case 0: sendChat(array[choice] + " You won!"); win = true; break;
					case 1: sendChat(array[choice] + " It's a tie!"); win = true; break;
					case 2: sendChat(array[choice] + " I won!"); break;
				}
				break;
			case 2:
				switch (choice) {
					case 0: sendChat(array[choice] + " I won!"); break;
					case 1: sendChat(array[choice] + " You won!"); win = true; break;
					case 2: sendChat(array[choice] + " It's a tie!"); win = true; break;
				}
			break;
		}
		if (win && giveBonus) {
			sendChat(`...Psst..! ${msg.p.name}..! Take this..!`);
			if (!registered(_id)) register(_id, msg.p.name);
			giveItem("coin", _id, 1000);
			stop();
		} else {
			stop();
		}
	} else {
		sendChat(`Pick something! (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
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
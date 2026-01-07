// callum fisher - 2023.11.27

import pkg from "edit-json-file";
const editJsonFile = pkg;
import fs from "fs";
import path from "path";
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = "stats";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "stats",
	category: "admin",
	on: true,
	hidden: true,
	wip: false,
	rank: 1,
	description: "Displays statistics about commands."
}

info.usage = `%cmdprefix%${info.name} <command-name> (optional)`;

async function run (args) {
	let msg = args.msg;
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let stats;
	if (!input) {
		let highest = {name: "", uses: -Infinity};
		let lowest = {name: "", uses: Infinity};
		fs.readdirSync(path.join(__dirname, `/stats/`)).forEach(file => {
			stats = editJsonFile(path.join(__dirname, `/stats/${file}`)).data;
			if (stats.uses > highest.uses) {highest.name=file.split("cmdstats-")[1].split(".json")[0];highest.uses=stats.uses};
			if (stats.uses < lowest.uses) {lowest.name=file.split("cmdstats-")[1].split(".json")[0];lowest.uses=stats.uses};
		});
		// sendChat(`Since the last system reboot, I've heard ${EOS.temp.stats.notesHeard} note(s) and read ${EOS.temp.stats.messagesSeen} message(s). You've sent ${EOS.temp.users[msg.p._id].msgsendcounter} message(s). The most popular command is: ${highest.name}.`);
		sendChat(`The most popular command is: ${highest.name}.`);
		sendChat(`For statistics of a command: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)}`);
		stop();
	} else {
		console.log("ee")
		fs.exists(path.join(__dirname, `/stats/cmdstats-${input}.json`), function(exists) {
			if (!exists) {
				sendChat("Statistics haven't yet been recorded for this command.");
			} else {
				stats = editJsonFile(path.join(__dirname, `/stats/cmdstats-${input}.json`)).data;
				sendChat("Since "+stats.since+", that command has been used "+stats.uses+" times.");
			}
			stop();
		});
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
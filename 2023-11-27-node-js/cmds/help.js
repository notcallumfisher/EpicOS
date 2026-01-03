// callum fisher - 2023.12.12

import database from "../db.js";
const { registered, register, get, set } = database;
import { Worker } from "worker_threads";
import { parentPort } from "worker_threads";
import { addToLog, setLogBossModuleName } from "../log.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import editJsonFile from "edit-json-file";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = "help";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "help",
	category: "Tools",
	on: true,
	hidden: true,
	wip: false,
	rank: 1,
	description: "Displays a list of commands & their functions."
}

info.usage = `%cmdprefix%${info.name} <Command-Name> (optional)`;

async function run (args) {
	let msg = args.msg;
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let qMsg = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let _id = msg.p._id;
	let underline = (n) => {
		for (var r = "", e = 0; e < n.length; e++) r += n[e] + "̲";
		return r;
	}
	if (!input) {
		if (!registered(_id)) register(_id, msg.p.name);
		let rank = get("rank", _id);
		let help = await runEval("commandHelp");
		let next = () => {
		let categories = [];
			Object.keys(help).forEach((category, index) => {
				let temp = '';
				help[category].forEach((command, cmdIndex) => {
					if (!command.hidden) {
						if (command.on && rank >= command.rank) {
							temp += `${cmdPrefix}${command.name}${command.alias ? " (" + cmdPrefix + command.alias + ")" : ""}`;
							if (cmdIndex !== help[category].length - 1) {
								temp += ", ";
							}
						}
					}
				});
				if (temp !== '') {
					categories.push(`${underline(category)}: ` + temp);
				}
			});
			let isRegistered = registered(_id);
			let editedHelp = categories.join(" | ");
			qMsg(`${!isRegistered ? "Hello! " : ""}${editedHelp}`);		
			if (!isRegistered) register(_id, msg.p.name);
			if (!get("hasBeenToldAboutSpecificCmdHelp", _id)) {
				qMsg(`For help with a specific command, you may send ${cmdPrefix}help <Command-Name>`);
				set("hasBeenToldAboutSpecificCmdHelp", true, _id);
			}
			stop();
		}
		if (Object.keys(help).length !== 0) {
			next();
		} else {
			qMsg("Hold on while I fetch that for you...");
			await runEval("generateHelpList()").then(async promise => {
				help = await runEval("commandHelp");
				next();
			});
		}
	} else {
		let commandAliases = editJsonFile("aliases.json");
		input = Object.keys(commandAliases.data).find(command => commandAliases.data[command].includes(input)) || input;
		fs.exists(path.join(__dirname, `/${input}.js`), exists => {
			if (exists) {
				//(`>> Help | ${input} >> ${require(path.join(__dirname, "../cmds/"+input+".js")).description} || Rank: ${require(path.join(__dirname, "../cmds/"+input+".js")).rank} || Usage: ${require(path.join(__dirname, "../cmds/"+input+".js")).usage.replace(/%cmdprefix%/g, cmdprefix)}`)
				let cmdFile = new Worker(`./cmds/${input}.js`);
				let cmdFileExit = () => {
					cmdFile.postMessage({"head": "stop"});
					cmdFile.off('message', handleCmdFile);
				}
				let handleCmdFile = (msg) => {
					if (msg.head == "info") {
						let info = msg.body;
						qMsg(`>> Help | "${input}" >> ${info.description} | Rank: ${info.rank} | Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)}`);
						cmdFileExit();
						stop();
					}
				}
				cmdFile.on("message", handleCmdFile);
				cmdFile.postMessage({"head": "info"});
			} else {
				qMsg(`>> Help | "${input}"..? >> There's no command by that name. You can send "${cmdPrefix}help" for a list of valid commands.`);
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

const stop = () => {
	parentPort.postMessage({"head": "stop"});
}

const runEval = input => {
	return new Promise((resolve, reject) => {
		let listener = message => {
			if (message.head == "eval") {
				resolve(JSON.parse(message.body));
				parentPort.off("message", listener);
			}
		}
		parentPort.on("message", listener);
		parentPort.postMessage({"head": "eval", "body": JSON.stringify(input)});
	});
}

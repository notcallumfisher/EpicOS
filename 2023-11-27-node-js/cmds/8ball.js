// callum fisher - 2023.12.06

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "8ball";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "8ball",
	category: "arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "This magic ball may just hold the answers to your questions..!"
}

info.usage = `%cmdprefix%${info.name} <yes-no-question>`;

function run (args) {
	let msg = args.msg;
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	if (!input) {
		sendChat(`Ask a question! (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
		stop();
	} else if (input.length < 10 && !input.includes(" ") || input.toLowerCase().startsWith("is the cake a lie")) {
		sendChat("🎱 Try to ask something more substantial.");
		stop();
	} else {
		sendChat("🎱 "+rando("As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.", "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.", "Without a doubt.", "Yes.", "Yes – definitely.", "You may rely on it."));
		stop();
	}
}

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};

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
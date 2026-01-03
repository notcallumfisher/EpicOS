// callum fisher - 2024.01.05

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "fortune";

setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "fortune",
	category: "arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Only listen to the fortune cookie; disregard all other fortune telling units."
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	let qMsg = (msg, bypass) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg, bypass: bypass || false }});
	}
	qMsg(`\u{1F960} ${rando([
		"If you look back, you'll soon be going that way.",
		"An alien of some sort will be appearing to you shortly.",
		"He who throws dirt is losing ground.",
		"We don't know the future, but here's a cookie.",
		"Never forget a friend. Especially if he owes you.",
		"Only listen to the fortune cookie; disregard all other fortune telling units.",
		"I see you.",
		"You are not illiterate.",
		"Avoid taking unnecessary gambles. Lucky numbers: 12, 15, 23, 28, 37.",
		"You think it's a secret, but they know.",
		"Don't let statistics do a number on you.",
		"Someone will invite you to a Karaoke party.",
		"It is a good day to have a good day.",
		"Never wear your best pants when you go to fight for freedom.",
		"You will regret doing that.",
		"Don't persue happiness - create it.", 
		"The real kindness comes from within you.",
		"You should embark on a new creative journey.",
		"A person who won't read has no advantage over a person who can't read.",
		"Happiness isn't an outside job, it's an inside job.",
		"People learn little from success, but much from failure.",
		"Your reality check is about to bounce.",
		"Tomorrow at breakfast, listen carefully: do what rice krispies tell you to.",
		"It is okay to look at the past and future. Just don't stare.",
		"Fortune not found? Abort, Retry, Ignore.",
		"Politicians are like diapers: change often, and for same reason.",
		"You will find a thing. It may be important.",
		"The older you get, the better you were.",
		"Your smile will tell you what makes you feel good."
	])}`);
	// runEval(`flingCursor(randomNum(-40, 40), 10);`);
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

const stop = () => {
	parentPort.postMessage({"head": "stop"});
}

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};
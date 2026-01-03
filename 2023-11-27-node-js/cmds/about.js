// callum fisher - 2023.11.27

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "about";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "about",
	category: "Main",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Displays info about the bot."
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	sendChat("Node.js bot written by slowstone72. Originally EpicOS for multiplayerpiano.com in 2015. | Special thanks: Squid/Casio/く8彡, SⱩΛȽȽΛǤɌIM/Ѵ͏ι͏͏ɗκ͏͏υ͏ηѕѕ͏о͏͏ηη͏, Electrashave, Logan, Chacha, CitronSustain/Vistril, Braden T, Anon64, Ham's Music, ๖ۣۜCharly/Charly, JPDLD and Chris.");
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
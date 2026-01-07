// callum fisher - 2023.12.22

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
const moduleName = "test";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "test",
	category: "test",
	on: true,
	hidden: true,
	wip: false,
	rank: 2,
	description: "test"
}

info.usage = `%cmdprefix%${info.name} <thing>`;

async function run (args) {
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	if (args.input == "import") await runEval("importMIDI()");
	if (args.input == "date") {
		let date=await runEval("getFormattedTimestamp()"); sendChat(date);
	}
	//await runEval("setCursorAnimation('circle')");
	// await runEval("desiredChannelSettings.color2=\"#000000\"");
	/*await runEval(`play(rando(MIDI.recordings))`)
	await runEval("console.log(JSON.stringify(MIDI.recordings))")*/
	// await runEval("performMaintenance()")
	await runEval("bot.client.sendArray([{ m: \"userset\", set: { name: \"EpicOS [?help]\", color: \"#648EFF\" }}]); // #8a91ff #8CDCFF set: #648EFF")
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

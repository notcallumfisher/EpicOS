// callum fisher - 2024.01.08

import database from "../db.js";
const { registered, register, giveItem } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "cracker";

setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "cracker",
	category: "Christmas",
	on: false,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Is it that time of year again? Let's pull a Christmas cracker!"
}

info.usage = `%cmdprefix%${info.name}`;

async function run (args) {
	let msg = args.msg;
	let input = args.input;
	let sendChat = (msg, bypass) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg, bypass: bypass || false }});
	}
	let name = msg.p.name;
	let _id = msg.p._id;
	let winnings = randomNum(1, 10);
	let win = Math.random() < 0.50; // 0.50 = 50%
	let joke = Math.random() < 0.70;
	// let fortune = Math.random() < 0.05; 
	if (await runEval(`typeof temp["${_id}"] == "undefined"`)) {
		await runEval(`temp["${_id}"] = {}`);
	}
	if (await runEval(`typeof temp["${_id}"].crackers == "undefined"`)) {
		await runEval(`temp["${_id}"].crackers = 10`);
	}
	let temp = await runEval(`temp["${_id}"]`);
	if (temp.crackers > 0) {
		await runEval(`temp["${_id}"].crackers--`);
		sendChat(`${rando(["\u{1f4a5}", "\u{1F384}"])} ${name} pulled a Christmas cracker with me and ${win ? "won" : "I won"} ${pluralize(winnings, "coin", "shiny")}!`, true);
		if (joke) sendChat(`${rando(["\u{1F31F}", "\u{1F384}"])} ${rando([
			"Why does your nose get tired in winter? It runs all day!",
			"Who is a Christmas tree’s favorite singer?	Spruce Springsteen!",
			"Why is the turkey never hungry at Christmas? It's stuffed!",
			"Why has Santa been banned from sooty chimneys? Carbon footprints!",
			"What do you get if you put a bell on a skunk? Jingle smells!",
			"What would you call an elf who just has won the lottery? Welfy!",
			"What did the farmer get for Christmas? A cowculator!",
			"What's every parent's favourite Christmas Carol? Silent Night!",
			"What do you get if you cross Santa with a duck? A Christmas Quacker!"
		])}`);
		if (!registered(_id)) register(_id, name);
		if (win) giveItem("coin", _id, winnings);
		stop();
	} else {
		sendChat(rando([
			`${name}, there are no more Christmas crackers left.`,
			`${name}, we've ran out!`,
			`${name}, we've ran out of Christmas crackers.`
		]));
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

const stop = () => {
	parentPort.postMessage({"head": "stop"});
}

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};

const pluralize = (count, noun, breaker) => {
	return `${count == 0 ? 'no' : String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${breaker ? ' ' + breaker + ' ' : ''} ${noun}${count !== 1 ? "s" : ''}`;
}

const randomNum = (min, max) => {
	return Math.floor(min + (Math.random() * (max - min)));
}


const runEval = async input => {
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
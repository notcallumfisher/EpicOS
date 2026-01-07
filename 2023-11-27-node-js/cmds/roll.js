// callum fisher - 2024.04.22

import database from "../db.js";
const { registered, register, hasItem, getInventory, giveItem, takeItem } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "roll";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "roll",
	category: "arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Roll the die and place a bet. If you you're lucky and get a 6, you'll win whatever you bet."
}

info.usage = `%cmdprefix%${info.name} <betting-amount> (optional)`;

let numbers = [1,2,3,4,5,6];

async function run (args) {
	let msg = args.msg;
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let sendChat = msg => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let _id = msg.p._id;
	let name = msg.p.name;
	if (!registered(_id)) register(_id, msg.p.name);
	let res = numbers[Math.floor(Math.random() * numbers.length)]; //(Math.floor(Math.random()*6)+1)
	let bet = input;
	let win = res == 6;
	let interrupt = Math.random() > 0.8;
	if (!await runEval(`temp["${_id}"]`)) {
		runEval(`temp["${_id}"] = {}`);
		runEval(`temp["${_id}"].rollingDie = false`);
	}
	let temp = await runEval(`temp["${_id}"]`);
	let notEnoughCoins;
	let hasCoins = hasItem("coin", msg.p._id);
	if (input) { // 6393
		if (isNaN(input) || input < 1 || input == Infinity) {
			sendChat(`Make a real bet! (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
			stop();
			return;
		}
	}
	if (!hasCoins) {
		notEnoughCoins = true;
	} else if (getInventory(_id)["coin"].amount < bet) {
		notEnoughCoins = true;
	}
	if (notEnoughCoins) {
		sendChat(rando([
			`Gambler ${name}, don't be silly.`,
			`It took them a while, but eventually ${name} realized they don't have any coins to place a bet with.`,
			"You don't have any coins to place a bet with!",
			"That would put you in debt. Play responsibly.",
			"No, you don't have enough coins to place that bet.",
			`Despite ${name}'s eagerness, they don't actually have any coins to place a bet with.`,
			"You're lacking coins.",
			"You have no coins.",
			"Oh! Looks like you don't have enough coins to place that bet right now.",
			"You don't have enough coins to place that bet right now.",
			"You need more coins to do that.",
			"You need to get some more coins to place that bet.",
			"Unfortunately, you don't have enough coins for that.",
			"You don't have enough coins for that.",
			"You need to gain more coins to do that.",
			"If only you had the coins to that.",
			"Show me the money."
		]));
		// sendChat(`You need ${pluralize(bet-getInventory(msg.p._id)["coin"].amount, "coin", "more")} to make that bet. You can make a maximum bet of ${pluralize(getInventory(msg.p._id)["coin"].amount, "coin")}.`);
		stop();
		return;
	}
	if (temp.rollingDie) {
		sendChat("You don't have another die to roll at the same time.");
		stop();
		return;
	}
	runEval(`temp["${_id}"].rollingDie = true`);
	sendChat(`${msg.p.name} ${bet == '' ? "is rolling the die..." : "made a bet of " + pluralize(Number(bet), "coin") + ". Rolling the die..."} \u{1F3B2}`);
	setTimeout(() => {
		if (interrupt && bet !== '') {
			sendChat(rando([
				"Wait - Where's the die?",
				"Where's the die?",
				`Please, ${msg.p.name}, stop throwing the die onto the floor.`,
				`Actually, ${msg.p.name}'s concentration was thrown off. Let's try again later.`,
				`Despite ${msg.p.name}'s best efforts, they managed to drop the die. Where did it go..?`,
				"Where did the die go?"
			]));
		} else {
			let wins = [
				`Lucky! ${msg.p.name} is a winner!`,
				"We have a winner!",
				"Nice.",
				"Great!",
				"Finally!",
				"Yes!",
				"Brilliant!",
				"Perfect roll!",
				"Perfect!",
				"That's great!",
				"Unbelievable!"
			];
			let losses = [
				"Unlucky!",
				"Unfortunate!",
				"Nope.",
				"What if you placed a really, really high bet?",
				"Not quite.",
				"Not quite!",
				"Nah.",
				"Nope!",
				"No!",
				"Not quite!",
				"Tough luck.",
				"Maybe next time.",
				"Typical.",
				"Typical!",
				"How unlucky!",
				"Oh!"
			];
			let message = `${win?rando(wins):rando(losses)} ${msg.p.name} rolled ${res>10&&res!==12?"an":"a"} ${res} out of 6${bet==""?"!":""} `;
			if (bet !== '') message += ` and ${win ? "won" : "lost"} a bet of ${pluralize(Number(bet), "coin")}!`;
			if (win) runEval(`flingCursor(randomNum(-40, 40), 20);`);
			sendChat(message);
		}
		runEval(`temp["${_id}"].rollingDie = false`);
		stop();
	}, bet == '' ? 5000 : 10000);
	if (win && !interrupt && bet !== '') {
		giveItem("coin", msg.p._id, Number(bet))
	} else if (bet!=="" && !interrupt) {
		takeItem("coin", msg.p._id, Number(bet))
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

function rando(r){return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};
function pluralize (count, noun, breaker) {
	return `${count}${breaker ? ' ' + breaker + ' ' : ''} ${noun}${count !== 1 ? "s" : ''}`;
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
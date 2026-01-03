// callum fisher - 2024.01.13

import database from "../db.js";
const { registered, register, hasItem, getInventory, giveItem, takeItem } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "invent";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "invent",
	category: "arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Get Creative! - And then earn coins."
}

info.usage = `%cmdprefix%${info.name} <text> (optional)`;

async function run (args) {
	let msg = args.msg;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let name = msg.p.name;
	let _id = msg.p._id;
	if (!await runEval(`temp["${_id}"]`)) {
		runEval(`temp["${_id}"] = {}`);
		runEval(`temp["${_id}"].inventing = false`);
	}
	let temp = await runEval(`temp["${_id}"]`);
	if (temp.inventing) {
		sendChat(`Inventor ${name}, you're already busy inventing something.`);
		stop();
	} else {
		await runEval(`temp["${_id}"].inventing = true`);
		let nouns = [
			"keyboard",
			"flower pot",
			"pillow",
			"lamp",
			"floor board",
			"cheeseburger",
			"tissue paper",
			"pizza",
			"box",
			"drum",
			"chicken",
			"electricity",
			"flower pot",
			"shoe lace",
			"shoe",
			"ball",
			"desk",
			"computer",
			"shirt",
			"toilet",
			"monitor",
			"moron",
			"oven",
			"cooker",
			"cheese",
			"storage medium",
			"photo frame",
			"machine",
			"cocktail"
		];
		let verbs = [
			"enhancing",
			"removing",
			"electrifying",
			"walking",
			"breeding",
			"burning",
			"duplicating",
			"bursting",
			"bouncing",
			"destroying",
			"converting",
			"diverting",
			"directing",
			"correcting",
			"catapulting",
			"inducing",
			"tying",
			"adapting",
			"busting",
			"diluting",
			"announcing",
			"arranging"
		];
		let theList = [
			"internet",
			"wheel"
		]
		let wowList = [
			"everything",
			"internet",
			"wheel",
			"earth",
			"minecraft",
			"computers",
			"life",
			"death",
			"air",
			"weather",
			"your mom",
			"ur mom",
			"your dad",
			"ur dad"
		];
	let invention;
	let marvel = Math.random() < 0.05; // 0.01 = 1%, 0.1 = 10%
	let steal = Math.random() < 0.02;
	if (input) {
		invention = input;
	} else {
		invention = `${rando(nouns)} ${rando(verbs)} ${rando(nouns)}`;
	}
	let paymentKey = {
		// 0: "useless",
		25: "moderately useful",
		50: "decent",
		100: "good",
		150: "great",
		200: "fantastic",
		// 250: "innovative",
		300: "brilliant",
		350: "timeless"
	}
	let payment = Number(rando(Object.keys(paymentKey)));
	let rating = paymentKey[payment];
	let inventionMinusThe = (invention.toLowerCase().split("the")[1] || invention.toLowerCase().split("the")[0]).trim();
	let inventionIsWheel = invention.toLowerCase() == "wheel";
	let inventionIsWow = wowList.includes(invention.toLowerCase()) || wowList.includes(`${inventionMinusThe}`); 
	sendChat(`Inventor ${name} begins work on their next invention...`);
	setTimeout(() => {
		runEval(`temp["${_id}"].inventing = false`);
		if (!registered(_id)) register(msg.p._id, name);
		if (payment > 0) {
			runAction({
				"action":"dbGive",
				"input": {
					"item": "coin",
					"_id": _id,
					"amount": payment
				}
			});
		}
		if (steal) {
			sendChat(`Inventor ${name} lost their work to thieves...`);
		} else {
			let newInvention = invention;
			if (Math.random() < 0.50) newInvention = `${titleCase(invention)}\u{2122}`;
			sendChat(`Esteemed inventor ${name} ${inventionIsWheel ? '(re)' : ''}invented${theList.includes(invention.toLowerCase()) ? ' the' : ''} ${input ? '' : 'a '} ${newInvention}${inventionIsWow ? ' (Wow!).' : '!'} That's ${rating}, I'll pay ${pluralize(payment, "coin")} for it.`);
			if (marvel) {
				runAction({
					"action": "dbGive",
					"input": {
						"item": "coin",
						"_id": _id,
						"amount": 12000
					}
				});
				sendChat(`${rando(["Actually", "Upon closer inspection,"])} ${name}, your ${newInvention} is ${rando(["revolutionary", "marvellous"])}! Let me borrow your idea. I'll award you some financial compensation...`); // of ${pluralize(12000, "coin")}.`);
				runAction({
					"action": "flingCursor",
					"input": {
						"direction": randomNumber(-40, 40),
						"force": 20
					}
				});
			}
		}
		stop();
	}, randomNumber(0, 120000));
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

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]}; // from Fishing
function pluralize (count, noun, breaker) {
	return `${count == 0 ? 'no' : String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${breaker ? ' ' + breaker + ' ' : ''} ${noun}${count !== 1 ? "s" : ''}`;
}

const randomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min) ) + min;
}

const runAction = async action => {
	let requestID = `${Date.now().valueOf()}-${Math.floor(Math.random() * 101)}`;
	return new Promise((resolve, reject) => {
		parentPort.on("message", message => {
			if (message.head !== "action") return;
			if (message.body.action !== action.name || message.body.requestID !== requestID) return;
			resolve(message.body.output);
			console.log(message.body.output);
		});
		console.log(JSON.stringify(action))
		parentPort.postMessage({
			"head": "action",
			"body": { ...action, requestID: requestID }
		});
	});
}
runAction({"action": "dbGet", "input": {"key": "inventory.coin", "_id": "593375fc0e40d8d6d163b8c8"}})
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
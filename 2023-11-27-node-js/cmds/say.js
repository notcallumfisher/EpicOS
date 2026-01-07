// callum fisher - 2024.01.13

import database from "../db.js";
const { registered, register, hasItem, getInventory, giveItem, takeItem } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";

const moduleName = "invent";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "say",
	category: "bad ideas",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "echoechoechoecho...echo..."
}

info.usage = `%cmdprefix%${info.name} <text>`;

async function run (args) {
	let msg = args.msg;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	if (!input) {
		sendChat(`Oh, Vienna - Usage: ${info.usage.replace(/%cmdprefix%/g, args.cmdPrefix)}`);
	} else {
		sendChat(correctGrammar(input));
	}
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

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};
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
runAction({"action": "dbGet", "input": {"key": "inventory.coin", "_id": ""}})
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


const correctGrammar = text => {
    const replacements = {
        "\\b(a|an)\\s+([a-z]+)": (match, article, word) => (/^[aeiou]/i.test(word) ? "an" : "a") + " " + word,
        "(^|\\.\\s*)(.)": (match, prefix, char) => prefix + char.toUpperCase(),
        "\\bi\\b": "I",
        "([^.])$": "$1.",
        "\\b(and|but|nor|or|so|yet)\\b([^,])": "$1,$2",
        "\\b([iywt]ou|who) is\\b": "$1's",
        "\\b([iyhstw]ou|that|there|what) will\\b": "$1'll",
        "\\b(i) am\\b": "$1'm",
        "\\b([hs]e|it|who) has\\b": "$1's",
        "\\b([hs]e|it) is\\b": "$1's",
        "\\b(im)\\b": "I'm",
        "\\b(ill)\\b": "I'll",
        "\\b(ive)\\b": "I've",
        "\\b(youre)\\b": "you're",
        "\\b(youve)\\b": "you've",
        "\\b(theyre)\\b": "they're",
        "\\b(weve)\\b": "we've",
        "\\b(shes)\\b": "she's",
        "\\b(hes)\\b": "he's",
        "\\b(its)\\b": "it's",
        "\\b(cant)\\b": "can't",
        "\\b(dont)\\b": "don't",
        "\\b(wont)\\b": "won't",
        "\\b(couldnt)\\b": "couldn't",
        "\\b(shouldnt)\\b": "shouldn't",
        "\\b(wouldnt)\\b": "wouldn't",
        "\\b(thats)\\b": "that's"
    };

    for (let pattern in replacements) {
        let regex = new RegExp(pattern, "gi");
        text = text.replace(regex, replacements[pattern]);
    }

    if (/\b(who|what|where|when|why|how|is|are|do|does|did|can|could|will|would|shall|should)\b/i.test(text) && !/\?[^?]*$/.test(text)) {
        text = text.replace(/.$/, "?");
    }

    text = text.replace(/[.?!]+$/, match => match[0]);

    return text;
}
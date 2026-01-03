// callum fisher - 2024.01.04

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
import pkg from "edit-json-file";
const editJsonFile = pkg;
import stringSimilarity from "string-similarity";

const moduleName = "contrometer";

setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "positometer",
	category: "arcade",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Makes use of the positometer to quantify how positive something might be."
}

info.usage = `%cmdprefix%${info.name} <Any Message>`;

function run (args) {
	let msg = args.msg;
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg, bypass: true }});
	}
	if (!input) {
		sendChat(`Give me something for the positometer to measure! (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
		stop();
	} else {
		let result = Number(analyzeSentiment(input).toFixed(1));
		sendChat(`${rando([
			"Initializing positometer... ",
			"",
			"Hmm... ",
			"Seems to be ",
			"According to my extensive research, that's "
		 ])}${result > 0 ? result + "%" : "not"} positive.`);
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

function analyzeSentiment(text) {
    const positiveWords = ["share", "fortune", "luck", "beauty", "up", "hello", "yes", "test", "agree", "good", "birth", "happy", "life", "positive", "joy", "love", "peaceful", "correct", "endearing", "grateful", "eager", "right", "true", "vibrant", "kind", "smart", "great", "thank", "pleasure", "welcome", "fascinating", "thrill", "interesting", "surprise", "party", "assistance", "help", "understand", "sure", "excellent", "respect"];
    const negativeWords = ["misfortune", "unlucky", "distaste", "ugly", "down", "goodbye", "no", "disagree", "misery", "useless", "kill", "sarcasm", "depressing", "bad", "sad", "death", "negative", "pain", "hate", "moron", "idiot", "incorrect", "wrong", "false", "dull", "stupid", "sorry", "sorrow", "afraid", "fear", "inappropriate", "disrespect", "boring", "predictable", "useless", "pointless", "waste", "regret", "pity"];

    let positiveCount = 0;
    let negativeCount = 0;

    let inputWords = text.split(/\s+/);

    for (let word of inputWords) {
        let positiveWord = stringSimilarity.findBestMatch(word, positiveWords).bestMatch;
        let negativeWord = stringSimilarity.findBestMatch(word, negativeWords).bestMatch;
        if (word == positiveWord.target || positiveWord.rating >= 0.3) {
            positiveCount ++;
        }
        if (word == negativeWord.target || negativeWord.rating >= 0.3) {
            negativeCount ++;
		}
    }

    let totalWords = positiveCount + negativeCount; // inputWords.length; // + negativeCount;
    let positivePercentage = (positiveCount / totalWords) * 100;
    let negativePercentage = (negativeCount / totalWords) * 100;

    return positivePercentage;
}
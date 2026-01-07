// callum fisher - 2024.01.11

import database from "../db.js";
const { registered, register, hasItem, getInventory, giveItem, takeItem } = database;
import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
import stringSimilarity from "string-similarity";
import editJsonFile from "edit-json-file";
import fs from "fs";
import path from "path";
import {
	fileURLToPath
} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = "search";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "search",
	category: "songs",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Allows you to search for a song."
}

info.usage = `%cmdprefix%${info.name} <song name>`;

async function run (args) {
	let cmdPrefix = args.cmdPrefix;
	let msg = args.msg;
	let input = args.input.toLowerCase();
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	let _id = msg.p._id;
	if (!input) {
		sendChat(`What would you like to search for? (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
		stop();
	} else {
		if (!await runEval(`temp["${_id}"]`)) {
			runEval(`temp["${_id}"] = {}`);
		}
		let temp = await runEval(`temp["${_id}"]`);
		if (!temp.currentSearch) temp.currentSearch = 0;
		let searchRange = 0;
		await runEval(`temp["${_id}"] = ${JSON.stringify(temp)}`);
		if (isNaN(input)) {
			temp.currentSearch = 1;
			temp.lastSearch = input;
		} else if (input > 0 && input < 9999) {
			temp.currentSearch = Number(input);
    		searchRange += 8 * (input - 1);
		}
		// sendChat(temp.currentSearch)
		let songs = editJsonFile(`${__dirname}/../songs.json`);
		let results = songs.data.index.filter(file => file.name.toLowerCase().includes(temp.lastSearch));
		let shortResults = results.slice(searchRange, searchRange+8);
		let searchString = '';
		shortResults.forEach(result => {
		  	let index = songs.data.index.findIndex(file => file.hash === result.hash);
		  	searchString += `#${index} - ${result.name}${shortResults.indexOf(result) !== shortResults.length-1 ? ", " : ""}`;
		});
		await runEval(`temp["${_id}"]=${JSON.stringify(temp)}`);
		if (shortResults.length > 0) {
			let remainingResults = results.length - (searchRange + shortResults.length);
			sendChat(`Found (${results.length}): ${searchString}`);
			if (remainingResults > 0) sendChat(`${pluralize(remainingResults, "result", "more")} found. Use ${cmdPrefix}${info.name} ${Number(temp.currentSearch)+1} to see more.`);
			stop();
		} else { // last resort:
			let results = stringSimilarity.findBestMatch(input, songs.data.index.map((file) => file.name));
			let result = results.bestMatch;
			let resultIndex = results.bestMatchIndex;
			let name = result.target
			let id = resultIndex;
  			let hash = songs.data.index[id].hash;
			sendChat(`The best I found was #${id} - ${result.target}.`);
			stop();
		}
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

function rando (r) {return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)]};
function pluralize (count, noun, breaker) {
	return `${count == 0 ? 'no' : String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${breaker ? ' ' + breaker + ' ' : ''} ${noun}${count !== 1 ? "s" : ''}`;
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

function titleCase(str) {
    let smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
    return str.split(' ').map(function(word, index, array) {
        if (index !== 0 && index !== array.length-1 && smallWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}
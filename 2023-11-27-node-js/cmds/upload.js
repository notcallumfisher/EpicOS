// callum fisher - 2023.12.26

import { addToLog, setLogBossModuleName } from "../log.js";
import { parentPort } from "worker_threads";
import fs from "fs";
import path from "path";
import {
	fileURLToPath
} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileTypeFromBuffer, fileTypeFromStream } from "file-type";
import validator from "validator";
import got from "got";
import { readChunk } from "read-chunk";
import { createHash } from "crypto";
import editJsonFile from "edit-json-file";

const moduleName = "songs";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

let info = {
	name: "upload",
	category: "songs",
	on: true,
	hidden: false,
	wip: false,
	rank: 1,
	description: "Allows you to add MIDI files to the song database."
}

info.usage = `%cmdprefix%${info.name} <URL to MIDI file> <Song Name> (optional)`;

async function run (args) {
	let cmdPrefix = args.cmdPrefix;
	let input = args.input;
	let msg = args.msg;
	let sendChat = (msg) => {
		parentPort.postMessage({"head": "say", "body": { msg: msg }});
	}
	if (!await runEval(`temp.downloadingMIDI`)) await runEval("temp.downloadingMIDI = false");
	let downloadingMIDI = await runEval(`temp.downloadingMIDI`);
	if (!input) {
		sendChat(`What song (MIDI file) would you like to upload? (Usage: ${info.usage.replace(/%cmdprefix%/g, cmdPrefix)})`);
		stop();
	} else if (downloadingMIDI) {
		sendChat("Sorry, I'm busy with another file. Please wait and try again later.");
		stop();
	} else {
		let url = input.split(" ")[0];
		let name = input.split(url)[1] || url;
		name = name.replace(/[/\\?%*:|"<>]/g, '-');
		name = titleCaps(name).trim();
		url = encodeURI(url);
		let isMidiFile = async (url) => {
			try {
				let stream = got.stream(url, {timeout:10000});
				const fileType = await fileTypeFromStream(stream);
    			if (fileType) {
					return fileType.mime == 'audio/midi';
				} else {
					return false;
				}
			} catch (err) {
				console.log(err)
				return false;
			}
		}
		async function getMidiFiles(directory) {
			const files = fs.readdirSync(directory);
			return files.filter(file => file.toLowerCase().endsWith('.mid'));
		}
		
		async function downloadMidi(url, name) {
			if (!validator.isURL(url)) {
				sendChat("Can you double-check for any typos in that URL?");
				stop();
				return;
			}
		
			if (!await isMidiFile(url)) {
				sendChat("Sorry, I'm having trouble finding a MIDI file at that address.");
				stop();
				return;
			}
			
			await runEval("temp.downloadingMIDI = true");

			let lastFileNum = 0;

			fs.readdirSync(`${__dirname}/../midiToImport`).forEach(file => {
				if (file.toLowerCase().includes(".mid")) {
					let fileName = file.split(".mid")[0]; 
					if (!isNaN(fileName)) if (Number(fileName) > lastFileNum) lastFileNum = Number(fileName);
				}
			});
			
			let fileID = lastFileNum + 1;

			try {
				let file = fs.createWriteStream(`${__dirname}/../midiToImport/${fileID}.mid`);
				let response = await got.stream(url, {timeout: 10000});
				let maxDownloadMB = 5 * 1024 * 1024; // maximum file size in megabytes
				let downloadedSize = 0;
    			response.on("data", async chunk => {
        			downloadedSize += chunk.length;
       				if (downloadedSize > maxDownloadMB) {
            			response.destroy();
            			sendChat(`DJ ${msg.p.name}, that's a lot of information I would rather not process right now.`);
						if (fs.existsSync(`${__dirname}/../midiToImport/${fileID}.mid`)) fs.unlinkSync(`${__dirname}/../midiToImport/${fileID}.mid`);
						await runEval("temp.downloadingMIDI = false");
						stop();
						return;
					}
				});
				response.pipe(file);
				file.on("finish", async () => {
					file.close();
					let isDuplicate = false;
					let duplicate;
					let erase = false;
					// double check that the file is a midi file (can't be too safe?):
					const buffer = await readChunk(`${__dirname}/../midiToImport/${fileID}.mid`, { startPosition: 0, length: 4000 });
    				const fileType = await fileTypeFromBuffer(buffer);
					// to-do: check for deletion before checking file hash... (oops)
					// if it's not a midi file, mark it for deletion:
    				if (fileType) erase = fileType.mime !== "audio/midi";
					let fetchHash = file => {
						return new Promise((resolve, reject) => {
							let fd = fs.createReadStream(file);
							let hash = createHash("md5");
							hash.setEncoding("hex");
							fd.on("end", async () => {
								hash.end();
								resolve(hash.read());
							});
							fd.pipe(hash);
						});
					}
					fetchHash(`${__dirname}/../midiToImport/${fileID}.mid`).then(async newFileHash => { // fetch hash of new file
						let songs = editJsonFile(`${__dirname}/../songs.json`);
						// check if saved hashes already includes new file's hash:
						let matchingHashIndex = songs.data.index.findIndex((file) => file.hash == newFileHash);
						if (matchingHashIndex !== -1) {
							let match = songs.data.index[matchingHashIndex];
							isDuplicate = true;
							erase = true;
							duplicate = { id: matchingHashIndex, name: match.name };
						}
						// check if other midis currently being uploaded share the new file's hash:
						fs.readdirSync(`${__dirname}/../midiToImport`).forEach((file) => {
							if (file !== `${fileID}.mid`) fetchHash(`${__dirname}/../midiToImport/${file}`).then(hash => {
								if (hash == newFileHash) isDuplicate = true; erase = true;
							});
						});
						if (erase) if (fs.existsSync(`${__dirname}/../midiToImport/${fileID}.mid`)) fs.unlinkSync(`${__dirname}/../midiToImport/${fileID}.mid`);
						await runEval("temp.downloadingMIDI = false");
						if (isDuplicate) {
							sendChat(`DJ ${msg.p.name}, that file has already been ${duplicate ? "imported" : "uploaded."}${duplicate ? " as #" + duplicate.id + " - " + duplicate.name + "" : ""}`);
							stop();
						} else {
							await runEval(`importMIDI(${fileID}, "${name}", true)`).then((result) => {
								sendChat(`Success! Imported ${name} as #${result.id}.`);
							}, error => {
								sendChat(`Sorry, I'm having some trouble importing ${name}.`);
							});
							stop();
						}
					});
				});
			} catch (error) {
				await fs.unlink(`${__dirname}/../midiToImport/${name}.mid`);
				sendChat("Sorry, I'm having trouble downloading that file.");
				stop();
			}
		}
		
		downloadMidi(url, name);
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

const titleCase = str => {
    let smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
    return str.split(' ').map(function(word, index, array) {
        if (index !== 0 && index !== array.length-1 && smallWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

/*
 * Title Caps
 * 
 * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
 * License: http://www.opensource.org/licenses/mit-license.php
 */

// (function(){
	var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
	var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";
  
	let titleCaps = function(title){
		var parts = [], split = /[:.;?!] |(?: |^)["�]/g, index = 0;
		
		while (true) {
			var m = split.exec(title);

			parts.push( title.substring(index, m ? m.index : title.length)
				.replace(/\b([A-Za-z][a-z.'�]*)\b/g, function(all){
					return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
				})
				.replace(RegExp("\\b" + small + "\\b", "ig"), lower)
				.replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
					return punct + upper(word);
				})
				.replace(RegExp("\\b" + small + punct + "$", "ig"), upper));
			
			index = split.lastIndex;
			
			if ( m ) parts.push( m[0] );
			else break;
		}
		
		return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
			.replace(/(['�])S\b/ig, "$1s")
			.replace(/\b(AT&T|Q&A)\b/ig, function(all){
				return all.toUpperCase();
			});
	};
    
	function lower(word){
		return word.toLowerCase();
	}
    
	function upper(word){
	  return word.substr(0,1).toUpperCase() + word.substr(1);
	}
// })();
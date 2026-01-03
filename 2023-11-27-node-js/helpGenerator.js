// callum fisher - 2024.01.07

import { addToLog, setLogBossModuleName } from "./log.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import editJsonFile  from "edit-json-file";
import { parentPort, Worker } from "worker_threads";

const commandAliases = editJsonFile("aliases.json");

parentPort.on("message", (message) => {
    let files = [];
	let fileCount = 0;
	let doneCount = 0;
    let commandHelp = {};
	fs.readdirSync(`${__dirname}/cmds`).forEach(file => {
		if (file.includes('.js')) {
			fileCount ++;
			files.push(file);
		}
	});
	let promises = files.map(file => new Promise(async (resolve, reject) => {
	    let cmdFile = new Worker(`${__dirname}/cmds/${file}`);
	    let cmdFileExit = async () => {
		    cmdFile.postMessage({"head": "stop"});
		    cmdFile.off('message', handleCmdFile);
	    }
        let handleCmdFile = async (message) => {
		    if (message.head == "info") {
			    let info = message.body;
			    if (!info.hidden) {
				    let cmd = file.split(".js")[0].trim();
			        let alias = cmd;
				    /* standardize ctgry such as "TOOLS" to "Tools": */ let category = info.category.charAt(0).toUpperCase() + info.category.substring(1).toLowerCase();
				    if (Object.keys(commandAliases.data).includes(cmd) && commandAliases.data[cmd][0].length < cmd.length) alias = commandAliases.data[cmd][0]; // if alias(es) found for this command, set its specified alias to the first alias listed
				    if (alias !== cmd) info.alias = alias;
				    if (!commandHelp[category]) commandHelp[category] = [];
				    commandHelp[category].push(info);
			    }
			    cmdFileExit();
			    doneCount ++;
			    resolve();
		    }
	    }
	    cmdFile.on("message", handleCmdFile);
		// probe for command information - e.g. name, rank, visibility, category:
		cmdFile.postMessage({"head": "info"});
	}));
	Promise.all(promises).then(async () => {
		parentPort.postMessage(commandHelp);
	});
});
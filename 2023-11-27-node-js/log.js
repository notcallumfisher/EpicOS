// callum fisher - 2023.11.12

import fs from "fs";

const moduleName = "LOGGER";

export let logBossModuleName;
export let sessionLog = '';

export function setLogBossModuleName (input) {
	logBossModuleName = input;
}

export function addToLog (moduleName, entry) {
	var entry = `${getFormattedTimestamp()} [${moduleName.toUpperCase()}]: ${entry}`;
	sessionLog += `\n${entry}`;
	console.log(entry);
}

// Handle finishing up logging:

var writing = false;
function exitHandler () {
	if (!writing) { // sometimes both of these exit events are fired, so this stops the following code from being triggered twice
		writing = true;
		addToLog(moduleName, `Application closed.`);
		var title = `${getFormattedTimestamp()}.txt`;
		fs.writeFileSync(`./logs/${logBossModuleName ? logBossModuleName+"-" : ""}${title}`, sessionLog);
		addToLog(moduleName, `Recorded log file as "${title}".`);
		process.exit();
	}
}

process.on("beforeExit", exitHandler);

process.on("uncaughtException", (error) => {
	addToLog(moduleName, `An error occurred:\n\n${JSON.stringify(error.message, Object.getOwnPropertyNames(error))}\n\n${JSON.stringify(error.stack, Object.getOwnPropertyNames(error)).split("\\n").join("\n")}\n`);
	process.exit();
});

function getFormattedTimestamp (date) {
	var date = date || new Date;
	return `${date.getYear() + 1900}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours() % 12 || 12}.${date.getMinutes()}.${date.getSeconds()}.${date.getHours() >= 12 ? "PM":"AM"}`;
}

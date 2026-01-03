// callum fisher - 2024.09.01

import { addToLog } from "./log.js";
import pkg from "edit-json-file";
const editjsonfile = pkg;
import fs from "fs";
import app from "./app.js";
const moduleName = "Launcher";

addToLog(moduleName, "Running.");

const valid_keys = { // this is a list of keys and their values which should be stored in configuration file:
	"firstTimeRun": true, // Whether or not this program is being run for the first time. This shouldn't be edited manually, unless some kind of tutorial mode is required again, or something similar.
	"detailedLogging": false, // Whether or not this program will record detailed information in its logging output. This shouldn't be edited manually unless troubleshooting is required.
	"configReady": false, // If you NEED the user to modify the configuration file before the program can work properly, you can set the default value of this key to false.
	"cmdPrefix": "?",
	"tokens": [],
	"servers": {
		"wss://mppclone.com": [
		{
			"name": "Epic's Room",
			"settings": {
				"playBackgroundMusic": true,
				"welcomeUsers": true,
				"welcomeTimeout": 120000,
				"welcomeMessage": "Welcome, %name%. Please feel free to play along or stay and chat. You can %cmdprefix%play, %cmdprefix%upload or %cmdprefix%stop songs of your own choice. You can send %cmdprefix%help for more commands.",
				"desiredChannelSettings": {
					"color": "#002A33",
					"color2": "#000000",
					"crownsolo": false,
					"no cussing": false,
					"visible": true,
					"limit": 20,
					"noindex": false,
					"chat": true
				},
				"desiredChannelSettingsOnSong": {
					"color": "#003301",
					"color2": "#000000"
				},
				"changeDesiredChSettingsOnSong": true,
				"sendCasualResponses": true,
				"casualResponseTimeout": 600000,
				"channelModeration": {
					"on": true,
					"warnRudeness": true,
					"warnThreshhold": 60,
					"kickbanRudeness": true,
					"kickbanRudenessMS": 0,
					"kickbanRudenessThreshhold": 80,
					"kickbanIfBotBanned": true,
					"disallowBots": false
				},
				"secondsBeforePianoInactive": 2
			}
		},
		{
			"name": "Roxas",
			"settings": {
				"playBackgroundMusic": true,
				"welcomeUsers": false,
				"sendCasualResponses": true,
				"secondsBeforePianoInactive": 12
			}
		},
		{
			"name": "lobby",
			"settings": {
				"playBackgroundMusic": true
			}
		},
		{
			"name": "lobby2"
		},
		{
			"name": "test/awkward"
		},
		{
			"name": "RP Room",
			"playBackgroundMusic": true,
			"secondsBeforePianoInactive": 30
		}
		]
	},
	"playBackgroundMusic": true,
	"secondsBeforePianoInactive": 30,
	"secondsBeforeChatInactive": 120,
	"notesPerSecondBeforeAdaptiveLimiting": 50,
	"maxMIDIInterruptions": 2,
	"noteHistoryCacheLimit": 100,
	"recorder": {
		"on": false,
		"maxSamples": 4,
		"maxSampleLength": 600
	},
	"casualResponseTimeout": 60000,
	"sendCasualResponses": true,
	"changeDesiredChSettingsOnSong": false,
	"desiredChannelSettingsOnSong": {
		"color": "#003301",
		"color2": "#000000"
	},
	"desiredChannelSettings": {
		"color": "#002A33",
		"color2": "#000000",
		"crownsolo": false,
		"no cussing": false,
		"visible": true,
		"limit": 20,
		"noindex": false,
		"chat": true
	},
	"lastMaintenanceCheck": Date.now().valueOf(),
	"lastTopSongReset": Date.now().valueOf(),
	"welcomeUsers": false,
	"welcomeTimeout": 120000,
	"welcomeMessage": "Welcome, %name%. Please feel free to play along or stay and chat. You can %cmdprefix%play, %cmdprefix%upload or %cmdprefix%stop songs of your own choice. You can send %cmdprefix%help for more commands.",
	"channelModeration": {
		"on": true,
		"warnRudeness": true,
		"warnThreshhold": 60,
		"kickbanRudeness": true,
		"kickbanRudenessMS": 0,
		"kickbanRudenessThreshhold": 80,
		"kickbanIfBotBanned": true,
		"disallowBots": false
	}
}
const valid_dirs = [
	"logs",
	"db",
	"midi",
	"midiBackup",
	"midiToImport",
	"cmds",
	"items"
];
let configChangeMade;

// Manage directories ++
valid_dirs.forEach(dir => { // Check the directories which are in the valid directories list and create any missing ones:
	fs.exists(`./${dir}`, function(exists) {
		if (!exists) {
			fs.mkdir(`./${dir}`, function(err) {
				if (err) {
					addToLog(moduleName, `ERROR: Failed to create directory "${dir}"!`, err);
					process.exit()
				} else {
					addToLog(moduleName, `Created directory: "${dir}"`);
				}
			});
		}
	});
});
// Manage directories --

// Manage config.json ++
addToLog(moduleName, `Checking configuration file integrity...`);
const config = editjsonfile("./config.json"); // load config.json
configChangeMade = false;
if (config.data.firstTimeRun == undefined) { // If the First Time Run key doesn't exist, then it's most likely the first time this program has been executed. Alternatively, it's may be that this program's saved data has been reset.
	configChangeMade = true;
	config.set("firstTimeRun", true);
} else if (config.data.firstTimeRun) {
	configChangeMade = true;
	config.set("firstTimeRun", false);
}
Object.keys(valid_keys).forEach(key => { // Check the keys currently in the configuration file for missing keys and add those missing keys:
	if (!Object.keys(config.data).includes(key)) {
		configChangeMade = true;
		addToLog(moduleName, `[config.json] Adding missing key "${key}" with value: ${JSON.stringify(valid_keys[key])}`);
		config.set(key, valid_keys[key]);
	}
});
Object.keys(config.data).forEach(key => { // Check the keys currently in the configuration file for unknown keys and remove those unknown keys:
	if (!Object.keys(valid_keys).includes(key)) {
		configChangeMade = true;
		addToLog(moduleName, `[config.json] Removing unknown key "${key}"`);
		delete config.data[key];
	}
});
if (config.data.detailedLogging) {
	addToLog(moduleName, `[config.json] Using the following options:`)
	Object.keys(config.data).forEach(key => { // Print out the key values being used:
			addToLog(moduleName, `[config.json] - ${key}: ${JSON.stringify(config.data[key])}`);
	});
}
if (configChangeMade) { // If changes have been made to the configuration file, record those changes: (there's no need to rewrite the file if no changes have been made)
	addToLog(moduleName, `Configuration file integrity check completed. Recording changes now.`);
	config.save();
} else {
	addToLog(moduleName, `Configuration file integrity check completed. No changes made.`);
}
// Manage config.json --

// Run the app:
if (config.get("configReady")) {
	app();
} else {
	addToLog(moduleName, `[!!!] Please review the configuration in "config.json" and change "configReady" to "true" [!!!]`);
}

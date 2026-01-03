// callum fisher - 2024.05.12

import { addToLog, setLogBossModuleName } from "./log.js";
import { Client as mppClient } from "./mppClient.js";
import database from "./db.js";
const { registered, register, get, set, giveItem, takeItem } = database;
import { Worker } from "worker_threads";
import editJsonFile from "edit-json-file";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import color from "hex-to-color-name";
import { createHash } from "crypto";
import stringSimilarity from "string-similarity";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
/*import pkg from "sqlite3";
const sqlite3 = pkg;*/

const items = require("./items.json");

// Open a database handle
/* let db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, error => {
    if (!error) {
        addToLog(moduleName, "SQLite3 initialized.");
    } else {
		addToLog(moduleName, `Error while setting up SQLite3: ${error}`);
    }
});

db.serialize(() => {
	db.run(`CREATE TABLE IF NOT EXISTS users (
		_id TEXT PRIMARY KEY,
		name TEXT,
		rank INTEGER,
		lastEdited INTEGER
	)`);
	db.run(`CREATE TABLE IF NOT EXISTS inventory (
		_id TEXT,
		itemID INTEGER,
		quantity INTEGER,
		properties TEXT,
		lastEdited INTEGER,
		PRIMARY KEY (_id, itemID),
		FOREIGN KEY(_id) REFERENCES users(_id) ON DELETE CASCADE
	)`);
	db.run(`CREATE TABLE IF NOT EXISTS banned (
		_id TEXT PRIMARY KEY,
		dateStart INTEGER,
		dateEnd INTEGER,
		reason TEXT,
		lastEdited INTEGER,
		FOREIGN KEY(_id) REFERENCES users(_id) ON DELETE CASCADE
	)`);
	// we don't need to store items in this database, a JSON file will do nicely:
	db.run(`CREATE TABLE IF NOT EXISTS items (
		ID TEXT PRIMARY KEY,
		name TEXT,
		lastEdited INTEGER
	)`);
});

// Close the database connection
/* db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});

db.all("SELECT * FROM users", [], (err, rows) => { // SELECT name FROM sqlite_master WHERE type='table';
	if (err) throw err;
	console.table(rows);
});

const isRegistered = _id => {
	return new Promise((resolve, reject) => {
		if (typeof _id !== "string") reject("invalidInput");
		db.get("SELECT _id FROM users WHERE _id = ?", [_id], (error, row) => {
		  	if (!error) {
				if (row) {
					resolve(true);
				} else {
					resolve(false);
				}
			} else {
				reject(error);
			}
		});
	});
}

const registerUser = options => {
	return new Promise((resolve, reject) => {
		if (typeof options !== "object" || typeof options._id !== "string" || options._id.length == 0) return reject("invalidInput");
		options = {
			...options,
			name: options.name || "Anonymous",
			rank: options.rank || 1
		}
		isRegistered(options._id).then((registered, error) => {
			if (!error) {
				if (!registered) {
					db.run(`INSERT INTO users (_id, name, rank, lastEdited) VALUES (?, ?, ?, ?)`,
					[options._id, options.name, options.rank, Date.now().valueOf()], error => {
						if (!error) {
						  	addToLog(moduleName, `Added user: id: "${options._id}", name: "${options.name}"`);
							resolve(false)
					  	} else {
						  	addToLog(moduleName, `Failed to add user: id: "${options._id}", name: "${options.name}"`);
							reject(false);
						}
					});
				} else {
					// addToLog(moduleName, `Failed to add user: id: "${options.name}" - user already added`);
					reject("duplicate");
				}
			} else {
				reject(false);
			}
		});
	});
}

const unregisterUser = _id => {
	return new Promise((resolve, reject) => {
		if (typeof _id !== "string" || _id.length == 0) return reject("invalidInput");
		isRegistered(_id).then((registered, error) => {
			if (!error) {
				if (registered) {
				    db.run(`DELETE FROM users WHERE _id = ?`, [_id], error => {
				        if (!error) {
				            addToLog(moduleName, `Removed user: id: "${_id}"`);
							resolve(true);
				        } else {
							addToLog(moduleName, `Failed to remove user: id: "${_id}"`);
							reject(false);
						}
					});
				} else {
					// addToLog(moduleName, `Failed to remove user: id: "${_id}" - user not found`);
					reject("notFound");
				}
			} else {
				reject(false);
			}
		});
	});
}

const confirmInventoryExists = _id => {
	return new Promise((resolve, reject) => {
		if (typeof _id !== "string" || _id.length == 0) reject("invalidInput");
		db.get("SELECT _id FROM inventory WHERE _id = ?", [_id], (error, row) => {
		  	if (!error) {
				if (!row) {
					db.run(`INSERT INTO inventory (_id, lastEdited) VALUES (?, ?)`,
					[_id, Date.now().valueOf()], error => {
						if (!error) {
							resolve(false);
					  	} else {
							reject(error);
						}
					});
				} else {
					resolve(true);
				}
			} else {
				reject(error);
			}
		});
	});
}

const hasItem = (_id, itemID) => {
	return new Promise((resolve, reject) => {
		if (typeof _id !== "string" || _id.length == 0 || typeof itemID !== "number") reject("invalidInput");
		confirmInventoryExists(_id).then((exists, error) => {
			if (!error) {
				db.get("SELECT itemID FROM inventory WHERE _id = ? AND itemID = ?", [_id, itemID], (error, row) => {
					if (!error) {
						if (row) {
							resolve(true);
						} else {
							resolve(false);
						}
					} else {
						reject(error);
					}
				});
			} else {
				reject(error);
			}
		});
	});
}

const getInventory = _id => {
	return new Promise((resolve, reject) => {
		if (typeof _id !== "string" || _id.length == 0) reject("invalidInput");
		db.all("SELECT itemID, quantity, properties FROM inventory WHERE _id = ?", [_id], (error, rows) => {
		  	if (!error) {
				if (rows) {
					resolve(rows.map(row => ({itemID: row.itemID, quantity: row.quantity, properties: JSON.parse(row.properties)})));
				} else {
					resolve([]);
				}
			} else {
				reject(error);
			}
		});
	});
}

const addItemToInventory = (_id, itemID, quantity, properties) => {
	return new Promise((resolve, reject) => {
		if (typeof _id !== "string" || typeof itemID !== "number" || typeof quantity !== "number" || typeof properties !== "string") reject("invalidInput");
		confirmInventoryExists(_id,)
		db.get("SELECT itemID FROM inventory WHERE _id = ? AND itemID = ?", [_id, itemID], (error, row) => {
		  	if (!error) {
				if (row) {
					// Item already exists in inventory, update it
					db.run(`UPDATE inventory SET quantity = ?, properties = ?, lastEdited = ? WHERE _id = ? AND itemID = ?`,
					[quantity, properties, Date.now().valueOf(), _id, itemID], error => {
						if (!error) {
							resolve(true);
					  	} else {
							reject(error);
						}
					});
				} else {
					// Item does not exist in inventory, add it
					db.run(`INSERT INTO inventory (_id, itemID, quantity, properties, lastEdited) VALUES (?, ?, ?, ?, ?)`,
					[_id, itemID, quantity, properties, Date.now().valueOf()], error => {
						if (!error) {
							resolve(true);
					  	} else {
							reject(error);
						}
					});
				}
			} else {
				reject(error);
			}
		});
	});
}

const fetchItemInfo = itemID => {
	return items.index.find(item => item.id == itemID);
}

console.log(fetchItemInfo(0));

getInventory("").then((inventory, error) => {
	if (!error) {
		console.log(inventory);
	}
}); */

const moduleName = "Main";

setLogBossModuleName(moduleName);

// Define global & default settings:
const config = require("./config.json");
// let maxRecordings = config.maxRecordings || 4;
let noteableTaskCount = 0;
let waitingToShutdown = false;
let restorableQueues = {};
let nameQueue = [];
let nameQueueLastSet = Date.now().valueOf() - 86400000;
let commandAliases = editJsonFile("aliases.json");

setInterval(() => {
	if (noteableTaskCount < 0) noteableTaskCount ++;
	if (waitingToShutdown) {
		if (noteableTaskCount == 0) {
			if (Object.keys(restorableQueues).length > 0) {
				let savedSongQueue = editJsonFile("restorableSongQueue.json");
				savedSongQueue.data = restorableQueues;
				savedSongQueue.save();
			}
			process.exit();
		}
	}
	let date = Date.now().valueOf();
	let config = editJsonFile("config.json")
	if (!config.data.lastMaintenanceCheck) {
		config.data.lastMaintenanceCheck = date;
		config.save();
	}
	if (date - config.data.lastMaintenanceCheck >= 604800000) {
		performMaintenance();
	}
}, 30000);

const MPPKeys = ['a-1', 'as-1', 'b-1', 'c0', 'cs0', 'd0', 'ds0', 'e0', 'f0', 'fs0', 'g0', 'gs0', 'a0', 'as0', 'b0', 'c1', 'cs1', 'd1', 'ds1', 'e1', 'f1', 'fs1', 'g1', 'gs1', 'a1', 'as1', 'b1', 'c2', 'cs2', 'd2', 'ds2', 'e2', 'f2', 'fs2', 'g2', 'gs2', 'a2', 'as2', 'b2', 'c3', 'cs3', 'd3', 'ds3', 'e3', 'f3', 'fs3', 'g3', 'gs3', 'a3', 'as3', 'b3', 'c4', 'cs4', 'd4', 'ds4', 'e4', 'f4', 'fs4', 'g4', 'gs4', 'a4', 'as4', 'b4', 'c5', 'cs5', 'd5', 'ds5', 'e5', 'f5', 'fs5', 'g5', 'gs5', 'a5', 'as5', 'b5', 'c6', 'cs6', 'd6', 'ds6', 'e6', 'f6', 'fs6', 'g6', 'gs6', 'a6', 'as6', 'b6', 'c7'];
const convKeys = ['a0', 'bb0', 'b0', 'c1', 'db1', 'd1', 'eb1', 'e1', 'f1', 'gb1', 'g1', 'ab1', 'a1', 'bb1', 'b1', 'c2', 'db2', 'd2', 'eb2', 'e2', 'f2', 'gb2', 'g2', 'ab2', 'a2', 'bb2', 'b2', 'c3', 'db3', 'd3', 'eb3', 'e3', 'f3', 'gb3', 'g3', 'ab3', 'a3', 'bb3', 'b3', 'c4', 'db4', 'd4', 'eb4', 'e4', 'f4', 'gb4', 'g4', 'ab4', 'a4', 'bb4', 'b4', 'c5', 'db5', 'd5', 'eb5', 'e5', 'f5', 'gb5', 'g5', 'ab5', 'a5', 'bb5', 'b5', 'c6', 'db6', 'd6', 'eb6', 'e6', 'f6', 'gb6', 'g6', 'ab6', 'a6', 'bb6', 'b6', 'c7', 'db7', 'd7', 'eb7', 'e7', 'f7', 'gb7', 'g7', 'ab7', 'a7', 'bb7', 'b7', 'c8'];
/* const keys = {
	"a0": "a-1",
	"bb0": "as-1",
	"b0": "b-1",
	"c1": "c0",
	"db1": "cs0",
	"d1": "d0",
	"eb1": "ds0",
	"e1": "e0",
	"f1": "f0",
	"gb1": "fs0",
	"g1": "g0",
	"ab1": "gs0",
	"a1": "a0",
	"bb1": "as0",
	"b1": "b0",
	"c2": "c1",
	"db2": "cs1",
	"d2": "d1",
	"eb2": "ds1",
	"e2": "e1",
	"f2": "f1",
	"gb2": "fs1",
	"g2": "g1",
	"ab2": "gs1",
	"a2": "a1",
	"bb2": "as1",
	"b2": "b1",
	"c3": "c2",
	"db3": "cs2",
	"d3": "d2",
	"eb3": "ds2",
	"e3": "e2",
	"f3": "f2",
	"gb3": "fs2",
	"g3": "g2",
	"ab3": "gs2",
	"a3": "a2",
	"bb3": "as2",
	"b3": "b2",
	"c4": "c3",
	"db4": "cs3",
	"d4": "d3",
	"eb4": "ds3",
	"e4": "e3",
	"f4": "f3",
	"gb4": "fs3",
	"g4": "g3",
	"ab4": "gs3",
	"a4": "a3",
	"bb4": "as3",
	"b4": "b3",
	"c5": "c4",
	"db5": "cs4",
	"d5": "d4",
	"eb5": "ds4",
	"e5": "e4",
	"f5": "f4",
	"gb5": "fs4",
	"g5": "g4",
	"ab5": "gs4",
	"a5": "a4",
	"bb5": "as4",
	"b5": "b4",
	"c6": "c5",
	"db6": "cs5",
	"d6": "d5",
	"eb6": "ds5",
	"e6": "e5",
	"f6": "f5",
	"gb6": "fs5",
	"g6": "g5",
	"ab6": "gs5",
	"a6": "a5",
	"bb6": "as5",
	"b6": "b5",
	"c7": "c6",
	"db7": "cs6",
	"d7": "d6",
	"eb7": "ds6",
	"e7": "e6",
	"f7": "f6",
	"gb7": "fs6",
	"g7": "g6",
	"ab7": "gs6",
	"a7": "a6",
	"bb7": "as6",
	"b7": "b6",
	"c8": "c7"
}; */

// Define global functions:
const rando = array => {
	return Array.isArray(array) || (array = Array.from(arguments)), array[Math.floor(Math.random() * array.length)];
}

/* const allTheSame = arr => {
	let array = arr.length - 1;
	while (array) {
		if (arr[array--] !== arr[array]) return false;
	}
	return true;
} */

const randomNum = (min, max) => {
	return min + (Math.random() * (max - min));
}

const convertNote = key => {
	return MPPKeys[convKeys.indexOf(key.toLowerCase())] || key.toLowerCase();
}

const  getFormattedTimestamp = date => {
	var t = date || new Date;
	return `${t.getFullYear()}.${t.getMonth() + 1}.${t.getDate()} ${t.getHours() % 12 || 12}:${t.getMinutes()} ${t.getHours() >= 12 ? "PM" : "AM"} (UTC+${t.getTimezoneOffset() / 60})`;
}

const pluralize = (count, noun, breaker) => {
	return `${count}${breaker ? ' ' + breaker + ' ' : ''} ${noun}${count !== 1 ? "s" : ''}`;
}

const calculateCursorDirectionFromNote = (note, noteValues, defaultDirection) => {
	let sum = noteValues.reduce((a, b) => a + b, 0);
	let averageNote = sum / noteValues.length;
	let direction = 0;
	if (MPPKeys.indexOf(note) < averageNote) {
		direction = -defaultDirection; // Left for lower notes
	} else if (MPPKeys.indexOf(note) > averageNote) {
		direction = defaultDirection; // Right for higher notes
	}
	return direction;
}

/* const suffixOf = f => {
	var n = f % 10,
		r = f % 100;
	return 1 == n && 11 != r ? f + "st" : 2 == n && 12 != r ? f + "nd" : 3 == n && 13 != r ? f + "rd" : f + "th"
} */

let ids = -1;

export default function app () {

	addToLog(moduleName, "Running.");

	const newInstance = (channel, server, settings) => {

		ids ++;
		
		let bot = {
			desiredChannel: channel,
			client: new mppClient(server, config.tokens[server] || "noTokenProvided")
		}

		// Define per-instance settings:

		let clientID = ids;

		let cursorAnimInfo = {};

		let setCursorAnimation = anim => {
			if (cursorAnimInfo.name == anim) return;
			switch (anim) {
				case "reactive":
					cursorAnimInfo = {
						name: "reactive",
						x: cursorAnimInfo.x,
						y: cursorAnimInfo.y,
						yBorderEnd: 80, // up/down
						yBorderStart: 70,
						xBorderEnd: 80,
						xBorderStart: 20,
						speed: 0.05,
						gravity: 0.4,
						velocity: {
							x: 0,
							y: 0
						},
						force: 0.4,
						direction: 146
					}
					break;
				case "reactiveFree":
					cursorAnimInfo = {
						name: "reactiveFree",
						x: cursorAnimInfo.x,
						y: cursorAnimInfo.y,
						yBorderEnd: 90, // bottom - up/down
						yBorderStart: 5, // top
						xBorderEnd: 90,
						xBorderStart: 5,
						speed: 0.05,
						gravity: 0.2,
						velocity: {
							x: 0,
							y: 0
						},
						force: 0.3,
						direction: 20
					}
					break;
				case "circle":
					cursorAnimInfo = {
						name: "circle",
						x: 50,
						y: 80,
						midPoint: {
							x: 50,
							y: 80
						},
						radius: 4,
						speed: 0.05,
						i: -500,
						ascend: true,
						reactive: false
					}
					break;
				case "infinity":
					cursorAnimInfo = {
						name: "infinity",
						x: 50,
						y: 80,
						midPoint: {
							x: 50,
							y: 80
						},
						radius: 4,
						reactive: true,
						speed: 0.05,
						i: -500,
					}
					break;
				case "randomFling":
					cursorAnimInfo = {
						name: "randomFling",
						x: cursorAnimInfo.x,
						y: cursorAnimInfo.y,
						yBorderEnd: 99, // up/down
						yBorderStart: 0,
						xBorderEnd: 99,
						xBorderStart: 0,
						speed: 0.05,
						gravity: 0.4,
						velocity: {
							x: 0,
							y: 0
						},
						flingChance: 0.05, // 0.05 = 5%
						force: 0.5,
						direction: 146 // 20
					}
					break;
				case "idle":
					cursorAnimInfo = {
						name: "idle",
						x: 99,
						y: 99,
						speed: 2
					}
					break;
			}
		}

		setCursorAnimation("circle");

		const handleCursorUpdates = async () => {
			if (song.playing || secondsSinceLastNote < 10) {
				if (song.averageNotesPerSecond < maxReactiveNotes / 2) {
					if (cursorAnimInfo.name !== "reactiveFree") {
						setCursorAnimation("reactiveFree");
					}
				} else if (song.averageNotesPerSecond < maxReactiveNotes) {
					if (cursorAnimInfo.name !== "reactive") {
						setCursorAnimation("reactive");
					}
				} else if (song.averageNotesPerSecond < maxReactiveNotes + maxReactiveNotes) {
					if (cursorAnimInfo.name !== "infinity") {
						setCursorAnimation("infinity");
						cursorAnimInfo.reactive = true;
					}
				} else if (song.averageNotesPerSecond < maxReactiveNotes * 10) {
					if (cursorAnimInfo.name !== "circle") {
						setCursorAnimation("circle");
					}
				} else if (cursorAnimInfo.name !== "randomFling") {
					setCursorAnimation("randomFling");
					cursorAnimInfo.flingChance = 0.50;
				}
			} else if (!song.playing && song.queue.length > 0) {
				if (cursorAnimInfo.name !== "circle") {
					setCursorAnimation("circle");
				}
			} else if (secondsBeforeChatInactive >= secondsSinceLastMessage) {
				if (cursorAnimInfo.name !== "randomFling") {
					setCursorAnimation("randomFling");
				}
			} else {
				if (cursorAnimInfo.name !== "idle") {
					setCursorAnimation("idle");
					song.history.noteValues = [];
					song.history.noteTimestamps = {};
				}
			}
		}
		
		// load specified & default settings:
		let welcomeUsers = settings.welcomeUsers || config.welcomeUsers;
		let welcomeMessage = settings.welcomeMessage || config.welcomeMessage;
		let welcomeTimeout = settings.welcomeTimeout || config.welcomeTimeout;
		let channelModeration = settings.channelModeration || config.channelModeration;
		let desiredChannelSettings = settings.desiredChannelSettings || config.desiredChannelSettings;
		let playBackgroundMusic = settings.playBackgroundMusic || config.playBackgroundMusic;
		let sendCasualResponses = settings.sendCasualResponses || config.sendCasualResponses;
		let casualResponseTimeout = settings.casualResponseTimeout || config.casualResponseTimeout;
		let secondsBeforePianoInactive = settings.secondsBeforePianoInactive || config.secondsBeforePianoInactive;
		let secondsBeforeChatInactive = settings.secondsBeforeChatInactive || config.secondsBeforeChatInactive;
		let cmdPrefix = settings.cmdPrefix || config.cmdPrefix;

		// load temporary settings:
		let welcomedUsers = [];
		let lastMessageRepeatCoolDownTimer = 0;
		let secondsSinceLastMessage = 0;
		let secondsSinceLastNote = 0;
		let casualResponsesOnLock = false;
		let maxReactiveNotes = 20;
		let cmdInfoCache = {};
		let lastMessage = '';
		let chatQueue = [];
		let mainInterval;
		let temp = {}; // command files can use this object to store temporary values


		let song = {
			interruptions: 0,
			maxInterruptions: config.maxMIDIInterruptions,
			playing: false,
			queue: [],
			current: {
				"file": null,
				"request": false,
				"recording": false
			},
			notes: [],
			notesPerSecond: 0,
			history: {
				cacheLimit: config.noteHistoryCacheLimit,
				notesPerSecond: [],
				noteVelocity: [],
				noteTimestamps: {},
				noteValues: []
			},
			adaptiveLimiting: {
				notesPerSecondBefore: config.notesPerSecondBeforeAdaptiveLimiting,
				on: false,
				noteLock: 50,
			},
			adaptiveVolume: false,
			noteLock: 50,
			minimumVolume: 0.1,
			ignoreSilentNotes: false,
			isSlowingDown: false,
			// adaptiveVolumeMultiplier: 2,
			recorder: {
				on: config.recorder.on,
				maxSamples: config.recorder.maxSamples,
				maxSampleLength: config.recorder.maxSampleLength,
				samples: [],
				users: []
			},
			useTempSettings: settings.changeDesiredChSettingsOnSong || config.changeDesiredChSettingsOnSong,
			changeDesiredChSettingsOnSong: settings.changeDesiredChSettingsOnSong || config.changeDesiredChSettingsOnSong,
			tempSettings: settings.desiredChannelSettingsOnSong || config.desiredChannelSettingsOnSong,
			averageNotesPerSecond: 1
		}

		// restore song queue:
		let savedSongQueue = editJsonFile("restorableSongQueue.json");
		if (Object.keys(savedSongQueue.data).length > 0) {
			Object.keys(savedSongQueue.data).forEach((ID) => {
				if (ID == clientID) {
					song.queue = savedSongQueue.data[ID];
					delete savedSongQueue.data[ID];
					savedSongQueue.save();
				}
			});
		}
		
		let noteQuota = {
			resetPoints: () => {
				noteQuota.points = noteQuota.max;
				noteQuota.history = [];
				for(var i = 0; i < noteQuota.maxHistLen; i++)
					noteQuota.history.unshift(noteQuota.points);
				if(noteQuota.cb) noteQuota.cb(noteQuota.points);
			},				
			setParams: params => {
				params = params || noteQuota.PARAMS_OFFLINE;
				var allowance = params.allowance || noteQuota.allowance || noteQuota.PARAMS_OFFLINE.allowance;
				var max = params.max || noteQuota.max || noteQuota.PARAMS_OFFLINE.max;
				var maxHistLen = params.maxHistLen || noteQuota.maxHistLen || noteQuota.PARAMS_OFFLINE.maxHistLen;
				if(allowance !== noteQuota.allowance || max !== noteQuota.max || maxHistLen !== noteQuota.maxHistLen) {
					noteQuota.allowance = allowance;
					noteQuota.max = max;
					noteQuota.maxHistLen = maxHistLen;
					noteQuota.resetPoints();
					return true;
				}
				return false;
			},
			tick: () => {
				// keep a brief history
				noteQuota.history.unshift(noteQuota.points);
				noteQuota.history.length = noteQuota.maxHistLen;
				// hook a brother up with some more quota
				if(noteQuota.points < noteQuota.max) {
					noteQuota.points += noteQuota.allowance;
					if(noteQuota.points > noteQuota.max) noteQuota.points = noteQuota.max;
					// fire callback
					if(noteQuota.cb) noteQuota.cb(noteQuota.points);
				}
			},
			spend: needed => {
				// check whether aggressive limitation is needed
				var sum = 0;
				for(var i in noteQuota.history) {
					sum += noteQuota.history[i];
				}
				if(sum <= 0) needed *= noteQuota.allowance;
				// can they afford it?  spend
				if(noteQuota.points < needed) {
					return false;
				} else {
					noteQuota.points -= needed;
					if(noteQuota.cb) noteQuota.cb(noteQuota.points); // fire callback
					return true;
				}
			},
			PARAMS_LOBBY: { allowance: 200, max: 600 },
			PARAMS_NORMAL: { allowance: 400, max: 1200 },
			PARAMS_RIDICULOUS: { allowance: 600, max: 1800 },
			PARAMS_OFFLINE: { allowance: 8000, max: 24000, maxHistLen: 3 }
		}
		noteQuota.setParams();
		// MIDI --
		const qMsg = (msg, bypass, dmID) => {
			if (typeof msg !== "string") msg = JSON.stringify(msg);
			if (dmID) {
				bot.client.sendArray([{
					m: "dm",
					_id: dmID,
					message: msg
				}]);
				return;
			}
			if (lastMessage !== msg || bypass) {
				msg.match(/.{0,511}/g).forEach(function(x, i) {
					if (x == "") return;
					if (i !== 0) x = "..." + x;
					chatQueue.push(x.trim());
				});
				lastMessage = msg;
			}
		}
		const advanceChatQueue = () => {
			let msg = chatQueue.splice(0, 1)[0];
			bot.client.sendArray([{
				m: "a",
				message: msg
			}]);
		}
		bot.client.start();
		let initialized = false;
		bot.client.on("hi", () => {
			if (initialized) return;
			initialized = true;
			addToLog(moduleName, `Connected to MPP server @ ${server}`);
			addToLog(moduleName, `Starting in channel: ${bot.desiredChannel}`);
			bot.client.setChannel(bot.desiredChannel);
			// if (bot.desiredChannel !== "lobby" && bot.desiredChannel !== "test/awkward" && bot.desiredChannel !== "Epic's Room") qMsg("initializing extreme booty detector...");
			// .client.sendArray([{ m: "userset", set: { name: "EpicOS [?help]", color: "#8a91ff" }}]); // #8a91ff #8CDCFF
			setInterval(() => {
				if (song.playing || secondsSinceLastNote < secondsBeforePianoInactive) { 
					let sum = song.history.notesPerSecond.reduce((a, b) => a + b, 0);
					let average = sum / song.history.notesPerSecond.length;
					song.averageNotesPerSecond = average == NaN ? 1 : average;
				}
				if (song.playing) {
					if (song.adaptiveLimiting.on) song.adaptiveLimiting.noteLock = song.averageNotesPerSecond / 2;
					if (song.notesPerSecond >= song.adaptiveLimiting.notesPerSecondBefore && !song.adaptiveLimiting.on) {
						song.adaptiveLimiting.on = true;
						song.ignoreSilentNotes = true;
					} else if (song.adaptiveLimiting.on) {
						song.adaptiveLimiting.on = false;
						song.ignoreSilentNotes = false;
					}
				}
				song.history.notesPerSecond.push(song.notesPerSecond);
				if (song.history.notesPerSecond.length > 10) {
					song.history.notesPerSecond.splice(0, 1)[0];
				}
				song.notesPerSecond = 0;
			}, 1000);
			mainInterval = setInterval(async () => {
				secondsSinceLastMessage += 1.5;
				lastMessageRepeatCoolDownTimer += 1.5;
				if (chatQueue.length > 0) advanceChatQueue();
				handleCursorUpdates();
				if (lastMessageRepeatCoolDownTimer >= 120) {
					lastMessageRepeatCoolDownTimer = 0;
					lastMessage = '';
				}
				if (cursorAnimInfo.name == "randomFling" && Math.random() < cursorAnimInfo.flingChance) flingCursor(randomNum(-40, 40), randomNum(0.5, 10));
				if (!song.playing) {
					secondsSinceLastNote += 1.5;
					if (secondsSinceLastNote >= secondsBeforePianoInactive && !waitingToShutdown) {
						if (song.queue.length > 0) {
							await playMIDI(song.queue.splice(0, 1)[0]);
						} else if (secondsBeforeChatInactive >= secondsSinceLastMessage && playBackgroundMusic) {
							if (song.recorder.samples.length > 0 && Math.random() < 0.70) { // 0.01 = 1% chance, 0.1 = 10% chance
								await play(song.recorder.samples.splice(0, 1)[0]);
							} else {
								await playMIDI();
							}
						}
					}
				}
				if (bot.client.channel) {
					if (bot.client.channel.crown) {
						if (bot.client.channel.crown.userId == bot.client.getOwnParticipant()._id) {
							if (song.playing && song.useTempSettings) {
								if (compareObjects(bot.client.channel.settings, song.tempSettings)) {
									setChannelSettings(song.tempSettings);
								}
							} else {
								if (compareObjects(bot.client.channel.settings, desiredChannelSettings)) {
									setChannelSettings(desiredChannelSettings);
								}
							}
						}
					}
				}
				song.recorder.users.forEach(user => {
					if (Date.now().valueOf() - temp[user].lastNote > 4000 && temp[user].recording.length > 0) {
						song.recorder.users.splice(song.recorder.users.indexOf(user), 1);
						temp[user].playing = false;
						song.recorder.samples.push(temp[user].recording);
						if (song.recorder.samples.length > song.recorder.maxSamples) song.recorder.samples.splice(0, 1)[0];
						temp[user].recording = [];
					}
				});
				if (waitingToShutdown && song.queue.length > 0 && !restorableQueues[clientID]) {
					let tempQueue = [];
					if (song.playing && !song.current.recording && song.current.request) tempQueue.push(song.current);
					song.queue.forEach((entry) => {
						tempQueue.push(entry);
					});
					restorableQueues[clientID] = tempQueue;
					console.log(`${clientID} ${bot.client.channel.id} saved tempQueue: ${JSON.stringify(tempQueue)}`);
				}
				if (!bot.client.isConnected()) bot.client.start();
			}, 1500);
			setInterval(() => {
				noteQuota.tick();
			}, 2000);
			setInterval(() => {
				if (nameQueue.length > 0 && Date.now().valueOf() - nameQueueLastSet >= 86400000/* 24 hr in ms */) bot.client.sendArray([{ m: "userset", set: { name: `${nameQueue.splice(0, 1)[0].replace(/%cmdprefix%/g, cmdPrefix)} (${cmdPrefix}help)` }}]); nameQueueLastSet = Date.now().valueOf();
			}, 30000);
			let handleMessage = async (msg, isDM) => {
				let dmID = isDM ? msg.sender._id : false;
				if (isDM) {
					msg = {
						p: {
							_id: msg.sender._id,
							name: msg.sender.name,
							color: msg.sender.color
						},
						a: msg.a
					}
				}
				secondsSinceLastMessage = 0;
				if (bot.client.channel) {
					let rudeness = howRude(msg.a);
					if (rudeness > 80) {
						if (msg.p._id == bot.client.getOwnParticipant()._id) {
							qMsg(rando([
								"Sorry, I didn't mean it.",
								"Well, I never meant it.",
								"oh.",
								"I didn't mean it.",
								"oops"
							]), false, dmID);
						}
					}
					if (channelModeration.on && bot.client.channel.crown) {
						if (bot.client.channel.crown.userId == bot.client.getOwnParticipant()._id) {
							if (channelModeration.warnRudeness && rudeness > channelModeration.warnRudenessThreshhold) qMsg("Please be polite.", false, dmID);
							if (channelModeration.kickbanRudeness && rudeness > channelModeration.kickbanRudenessThreshhold) {
								bot.client.sendArray([{ m: "kickban", _id: msg.p._id, ms: channelModeration.kickbanRudenessMS }]);
							}
						}
					}
				}
				if (msg.p._id == bot.client.getOwnParticipant()._id) return;
				if (!registered(msg.p._id)) register(msg.p._id, msg.p.name);
				registerUser({ _id: msg.p._id, name: msg.p.name }).catch(() => {});
				if (get("banned", msg.p._id)) return; // you are dead to me
				// you are not dead to me:
				if (sendCasualResponses && !casualResponsesOnLock) {
					let message = msg.a.toLowerCase();
					let yes = true;
					switch (message) {
						/* case "hello":
						case "hi":
						case "hey":
						case "greetings":
							qMsg(rando([
								"Hello!",
								"Have a nice day :)"
							]));
							break;
						case "thanks":
						case "thank you":
						case "thx":
							qMsg("You're whalecum!");
							break; */
						case "back":
							qMsg("front", false, dmID);
							break;
						case "front":
							qMsg("back", false, dmID);
							break;
						case "sorry":
							qMsg(":)", false, dmID);
							break;
						default:
							yes = false;
					}
					if (yes) {
						casualResponsesOnLock = true;
						setTimeout(() => {
							casualResponsesOnLock = false;
						}, casualResponseTimeout);
					}
				}
				if (msg.a.toLowerCase() == "stop" && song.playing && !song.current.request) resetMIDIData();
				if (msg.a.startsWith(cmdPrefix) && msg.a !== cmdPrefix) {
					if (waitingToShutdown) {
						qMsg(`Sorry, but I'm busy finalizing a few things before I shutdown. I'll be back soon. (waiting for ${pluralize(noteableTaskCount, "task")})`, false, dmID);
						return;
					}
					let cmd = msg.a.toLowerCase().split(cmdPrefix)[1].split(" ")[0].replace(/\//g, '').replace(/\\/g, '');
					let input = msg.a.substring(cmdPrefix.length + cmd.length).trim();
					let noIssues = true;
					cmd = Object.keys(commandAliases.data).find(command => commandAliases.data[command].includes(cmd)) || cmd;
					console.log(cmd);
					fs.exists(`cmds/${cmd}.js`, async (exists) => {
						if (exists && noIssues) {
							let cmdFile = new Worker(`./cmds/${cmd}.js`);
							let cmdFileExit = () => {
								cmdFile.postMessage({
									"head": "stop"
								});
								cmdFile.off("message", handleCmdFile);
								noteableTaskCount --;
							}
							let rank = get("rank", msg.p._id);
							let handleCmdFile = async message => {
								if (message.head == "info") {
									cmdInfoCache[cmd] = message.body;
									if (!message.body.on) {
										qMsg("Sorry, that command isn't on right now.", false, dmID);
										cmdFileExit();
									} else if (message.body.rank > rank) {
										// qMsg("Sorry, that's limited to certain people.", false, dmID);
										cmdFileExit();
									} else {
										if (message.body.wip) qMsg("This function might still need some work, please bear with me for a moment...", false, dmID);
										cmdFile.postMessage({
											"head": "run",
											"body": {
												"msg": msg,
												"cmdPrefix": cmdPrefix,
												"input": input
											}
										});
										let cmdStats = editJsonFile(`./cmds/stats/cmdstats-${cmd}.json`);
										noteableTaskCount ++;
										if (!cmdStats.data.uses) {
											cmdStats.data = {
												"uses": 1,
												"since": getFormattedTimestamp()
											};
										} else {
											cmdStats.data.uses ++;
										}
										cmdStats.save();
									}
								} else if (message.head == "action") {
									let actionInput = message.body.input;
									let actionOutput;
									switch (message.body.action) {
										case "dbGet":
											actionOutput = get(actionInput.key, actionInput._id);
											break;
										case "dbSet":
											actionOutput = set(actionInput.key, actionInput._id);
											break;
										case "dbTake":
											actionOutput = takeItem(actionInput.item, actionInput._id, actionInput.amount || 1);
											break;
										case "dbGive":
											actionOutput = giveItem(actionInput.item, actionInput._id, actionInput.amount || 1);
											break;
										case "flingCursor":
											flingCursor(actionInput.direction || 0, actionInput.force || 20);
											break;
									}
									cmdFile.postMessage({
										"head": "action",
										"body": {
											"requestID": message.body.requestID || 0,
											"output": actionOutput || true
										}
									});
								} else if (message.head == "eval") {
									try {
										let result = await eval(JSON.parse(message.body));
										cmdFile.postMessage({
											"head": "eval",
											"body": JSON.stringify(result)
										});
									} catch (error) {
										cmdFile.postMessage({
											"head": "eval",
											"body": JSON.stringify(error)
										});
									}
								} else if (message.head == "say") {
									qMsg(message.body.msg, message.body.bypass || false, dmID);
								} else if (message.head == "error") {
									qMsg("Sorry, that still needs some work.", false, dmID);
									cmdFileExit();
									cmdInfoCache[cmd].on = false;
									cmdInfoCache[cmd].error = true;
								} else if (message.head == "stop") {
									cmdFileExit();
								}
							}
							cmdFile.on("message", handleCmdFile);
							cmdFile.postMessage({
								"head": "info"
							});
						}
					});
				}
			}
			bot.client.on("dm", msg => {
				handleMessage(msg, true);
			});
			bot.client.on("a", msg => {
				handleMessage(msg, false);
			});
			bot.client.on("participant removed", msg => {
				if (song.playing && song.current.request) if (song.current.by._id == msg._id) resetMIDIData();
			});
			bot.client.on("participant added", msg => {
				if (msg._id == bot.client.getOwnParticipant()._id) return;
				// if (!registered(msg._id)) register(msg._id, msg.name);
				if (bot.client.channel) {
					if (bot.client.channel.crown) {
						if (bot.client.channel.crown.userId == bot.client.getOwnParticipant()._id) {
							let ban = false;
							if (channelModeration.on) {
								if (channelModeration.kickbanIfBotBanned && registered(msg._id)) if (get("banned", msg._id)) ban = true;
								if (channelModeration.disallowBots) {
									if (msg.tag) {
										if (msg.tag.text.toLowerCase() == "bot") ban = true;
									}
								}
								if (ban) bot.client.sendArray([{ m: "kickban", _id: msg._id, ms: 3600000 }]);
							}
							// if (!temp[msg._id]) temp[msg._id] = {};
							if (welcomeUsers && !waitingToShutdown && !ban && !welcomedUsers.includes(msg._id)) {
								welcomedUsers.push(msg._id);
								if (welcomedUsers.length > 50) welcomedUsers.splice(0, 1)[0];
								qMsg(welcomeMessage.replace(/%cmdprefix%/g, cmdPrefix)
								.replace(/%name%/g, msg.name !== "Anonymous" ? msg.name : msg.name + " (" + color(msg.color) + ")")
								.replace(/%channel%/g, bot.client.channel.id));
								welcomeUsers = false;
								setTimeout(() => {
									welcomeUsers = true;
								}, welcomeTimeout);
							}
						}
					}
				}
			});
			bot.client.on("nq", nq_params => {
				// console.log(nq_params)
				noteQuota.setParams(nq_params);
			});
			let handleNoteEvent = async msg => {
				if (msg.p.id == bot.client.getOwnParticipant().id) return;
				// let now = Date.now().valueOf();
				msg.n.forEach(async note => {
					if (!note.v) return;
					   if (note.v > 0) {
						secondsSinceLastNote = 0;
						song.notesPerSecond ++;
						/* if (song.recorder.on) {
							if (!temp[msg.p.id]) temp[msg.p.id] = {};
							if (!temp[msg.p.id].recording) temp[msg.p.id].recording = [];
							temp[msg.p.id].playing = true;
							if (!song.recorder.users.includes(msg.p.id)) song.recorder.users.push(msg.p.id);
							temp[msg.p.id].lastNote = now;
							temp[msg.p.id].recording.push({time: now, note: note});
							if (temp[msg.p.id].recording.length > song.recorder.maxSampleLength) temp[msg.p.id].recording.splice(0, 1)[0];
						} */
					}
					if (cursorAnimInfo.name.includes("reactive")) {
						let noteName = convertNote(note.n);
						song.history.noteValues.push(MPPKeys.indexOf(noteName));
						if (song.history.noteValues.length > 50) song.history.noteValues.splice(0, 1)[0];
						flingCursor(calculateCursorDirectionFromNote(noteName, song.history.noteValues, cursorAnimInfo.direction), cursorAnimInfo.force);
					}
				});
				if (song.playing && !song.current.request) /* we persevere through interruptions during song requests */ song.interruptions ++; if (song.interruptions > song.maxInterruptions) resetMIDIData();
			}
			bot.client.on("n", handleNoteEvent);
		});

		/* bot.fun.follow = function (part) {
			if (bot.temp.followInt) clearInterval(bot.temp.followInt);
			bot.temp.followInt = setInterval(() => {	
				bot.client.sendArray([{m: "m", x: part.x, y: part.y}]);
			}, 100);
		} */

		function compareObjects(obj1, obj2) {
			let diff = {};
			for (let key in obj2) {
				if (obj1.hasOwnProperty(key)) {
					if (obj1[key] !== obj2[key]) {
						diff[key] = obj2[key];
					}
				} else {
					diff[key] = obj2[key];
				}
			}
			return Object.keys(diff).length > 0 ? diff : false;
		}
		

		const setChannelSettings = settings => {
			if (bot.client.channel) {
				if (bot.client.channel.crown) {
					if (bot.client.channel.crown.userId == bot.client.getOwnParticipant()._id) {
						let editedSettings = compareObjects(bot.client.channel.settings, settings);
						if (editedSettings) {
							bot.client.sendArray([{
								m:"chset",
								set: editedSettings
							}]);
						}
					}
				}
			}
		}

		const animateCursor = () => {
			setTimeout(() => {
				switch (cursorAnimInfo.name) {
					case "reactive":
					case "reactiveFree":
					case "randomFling":
						cursorAnimInfo.velocity.y += cursorAnimInfo.gravity;
						cursorAnimInfo.x += cursorAnimInfo.velocity.x;
						cursorAnimInfo.y += cursorAnimInfo.velocity.y;
						let dampening = 0.9;
						if (cursorAnimInfo.x > cursorAnimInfo.xBorderEnd) {
							cursorAnimInfo.velocity.x *= -dampening;
							cursorAnimInfo.x = cursorAnimInfo.xBorderEnd;
						}
						if (cursorAnimInfo.x < cursorAnimInfo.xBorderStart) {
							cursorAnimInfo.velocity.x *= -dampening;
							cursorAnimInfo.x = cursorAnimInfo.xBorderStart;
						}
						if (cursorAnimInfo.y > cursorAnimInfo.yBorderEnd) {
							cursorAnimInfo.velocity.y *= -dampening;
							cursorAnimInfo.y = cursorAnimInfo.yBorderEnd;
						}
						if (cursorAnimInfo.y < cursorAnimInfo.yBorderStart) {
							cursorAnimInfo.velocity.y *= -dampening;
							cursorAnimInfo.y = cursorAnimInfo.yBorderStart;
						}
						if (cursorAnimInfo.velocity.y > 0) cursorAnimInfo.velocity.y *= dampening;
						if (cursorAnimInfo.velocity.x > 0) cursorAnimInfo.velocity.x *= dampening;
						break;
					case "circle":
						{
							let midPoint = cursorAnimInfo.midPoint;
							let angleIncrement = !cursorAnimInfo.reactive ? 0.05 : song.averageNotesPerSecond / 100; // increase this value to increase the speed of the animation
							let angle = cursorAnimInfo.i + angleIncrement;
							cursorAnimInfo.i = angle;
							cursorAnimInfo.x = midPoint.x + cursorAnimInfo.radius * Math.sin(angle);
							cursorAnimInfo.y = midPoint.y + cursorAnimInfo.radius * Math.cos(angle);
						}
						break;
					case "infinity":
						let res = song.averageNotesPerSecond / 140; // 280
						res = isNaN(res) ? 1 : res;
						console.log(res);
						let midPoint = cursorAnimInfo.midPoint;
						let angleIncrement = res == NaN ? 1 : res // cursorAnimInfo.reactive ? Math.ceil(Number((song.averageNotesPerSecond / 100).toFixed(1))) : 0.05; // increase this value to increase the speed of the animation
						let angle = cursorAnimInfo.i + angleIncrement;
						cursorAnimInfo.i = angle;
						let radius = cursorAnimInfo.radius;
						let offsetX = radius * Math.cos(angle);
						let offsetY = radius * Math.sin(2 * angle) / 2; // divide by 2 to make the figure 8 narrower
						// Depending on the angle, switch the direction of the circle
						if (angle % (2 * Math.PI) < Math.PI) offsetX = -offsetX;
						cursorAnimInfo.x = midPoint.x + offsetX;
						cursorAnimInfo.y = midPoint.y + offsetY;
						break;
				}
				if (!cursorAnimInfo.lastSentCoords) cursorAnimInfo.lastSentCoords = { x: Math.random(), y: Math.random() };
				if (cursorAnimInfo.x !== cursorAnimInfo.lastSentCoords.x || cursorAnimInfo.y !== cursorAnimInfo.lastSentCoords.y) {
					cursorAnimInfo.lastSentCoords = {
						x: cursorAnimInfo.x,
						y: cursorAnimInfo.y
					}
					bot.client.sendArray([{
						m: "m",
						x: cursorAnimInfo.x,
						y: cursorAnimInfo.y
					}]);
				}
				animateCursor(); // next animation update
			}, cursorAnimInfo.speed * 1000);
		}

		animateCursor();

		/* const flingCursor = (direction, force) => {
			// Convert degrees to radians
			let angle = (direction - 90) / 180 * Math.PI;
			// Calculate velocity based on direction and force
			let x = Math.cos(angle);
			let y = Math.sin(angle);
			cursorAnimInfo.velocity.x += x * force;
			cursorAnimInfo.velocity.y += y * force;
		} */
		
		const flingCursor = async (direction, force) => {
			// Convert degrees to radians
			let angle = (direction - 90) / 180 * Math.PI;
			// Calculate velocity based on direction and force
			cursorAnimInfo.velocity.x += Math.cos(angle) * force;
			cursorAnimInfo.velocity.y += Math.sin(angle) * force;
		}

/* let flingQueue = [];

setInterval(() => {
	if (cursorAnimInfo.name !== "reactive" && cursorAnimInfo.name !== "reactiveFree" && cursorAnimInfo.name !== "randomFling") return;
	if (flingQueue.length == 0) return;
	let { direction, force } = flingQueue.splice(0, 1)[0];
	let angle = (direction - 90) / 180 * Math.PI;
	cursorAnimInfo.velocity.x += Math.cos(angle) * force;
	cursorAnimInfo.velocity.y += Math.sin(angle) * force;
}, 50);

const flingCursor = async (direction, force) => {
	if (flingQueue.length > 50) return;
	if (cursorAnimInfo.name !== "reactive" && cursorAnimInfo.name !== "reactiveFree" && cursorAnimInfo.name !== "randomFling") return;
	flingQueue.push({ direction, force });
}; */

		

		// MIDI Player:

		/* const convertToPercentage = (value) => {
			let percentage = value / 100;
			if (percentage > 1) {
				percentage = 0.7;
			} else if (percentage < 0) {
				percentage = 0.3;
			}
			return percentage;
		} */

		const isNoteLocked = note => {
			let timestamps = song.history.noteTimestamps;
			let now = Date.now().valueOf();
			if (timestamps[note] && now - timestamps[note] < (song.adaptiveLimiting.on ? song.adaptiveLimiting.noteLock : song.noteLock)) {
				return true;
			}
			song.history.noteTimestamps[note] = now;
			return false;
		}

		const resetMIDIData = () => {
			if (song.playing) noteableTaskCount --;
			song.playing = false;
			song.adaptiveVolume = false;
			if (song.changeDesiredChSettingsOnSong) song.useTempSettings = false;
			song.notesPerSecond = 0;
			song.current.recording = false;
			song.history.notesPerSecond = [];
			song.history.noteVelocity = [];
			song.history.noteTimestamps = {};
			song.history.noteValues = [];
			secondsSinceLastNote = 0;
			song.interruptions = 0;
 			MPPKeys.forEach((note) => {
				bot.client.stopNote(note);
				// if (song.notes.includes(note)) song.notes.splice(song.notes.indexOf(note), 1);
			});
			midiPlayer.postMessage({"head":"stop"});
		}

		const handleNote = (note, velocity) => {
			if (!noteQuota.spend(1)) return;

			// Stopping notes:
			if (!velocity) {
				bot.client.stopNote(note); 
				// if (song.notes.includes(note)) {
					bot.client.stopNote(note); 
					//song.notes.splice(song.notes.indexOf(note), 1);
				// }
				return;
			}

			// Starting notes:
			song.history.noteVelocity.push(velocity);
			if (song.history.noteVelocity.length > song.history.cacheLimit) {
				song.history.noteVelocity.splice(0, 1)[0];
			}

			/* Slow down to recover notequota:
			if (noteQuota.points < 20 && !song.isSlowingDown) {
				song.isSlowingDown = true; midiPlayer.postMessage({"head":"tempo", "tempo": 5});
				setTimeout(() => {
					song.isSlowingDown = false;
					midiPlayer.postMessage({"head":"tempo", "tempo": 120});
				}, 30000);
			} */

			if (noteQuota.points < 20) {
				if (song.current.request) qMsg(`Stopped #${song.current.id} after exceeding the note limit.`);
				resetMIDIData();
			}

			// Toggle adaptive volume on consistent velocity:
			/*let activateAdaptiveVolume = () => {
				song.adaptiveVolume = true;
			}
			if (!song.adaptiveVolume && !song.adaptiveLimiting && song.velocityHistory.length > 50 && allTheSame(song.velocityHistory)) {
				activateAdaptiveVolume();
			}*/
			/* if (song.adaptiveVolume && !song.adaptiveLimiting) {
				let sum = song.notesPerSecondHistory.reduce((a, b) => a + b, 0);
				let average = sum / song.notesPerSecondHistory.length;
				velocity = convertToPercentage(average * song.adaptiveVolumeMultiplier);
			} */

			// Finally, start the note:
			if (song.ignoreSilentNotes ? velocity >= 0.1 : true) { // && !song.notes.includes(note)) {
				bot.client.startNote(note, velocity); // song.notes.push(note);
				song.notesPerSecond ++;
				if (cursorAnimInfo.name.includes("reactive")) {
					song.history.noteValues.push(MPPKeys.indexOf(note));
					if (song.history.noteValues > song.history.cacheLimit) song.history.noteValues.splice(0, 1)[0];
					flingCursor(calculateCursorDirectionFromNote(note, song.history.noteValues, cursorAnimInfo.direction), cursorAnimInfo.force);
				}
			}
		}

		let midiPlayer;
		song.midiWorkerActive = false;
		const setupMIDIWorker = () => {
			song.midiWorkerActive = true;
			addToLog(moduleName, "Setting up MIDI worker...");
			midiPlayer = new Worker("./midi.js");
			let reset = restart => {
				song.midiWorkerActive = false;
				addToLog(moduleName, "Resetting MIDI worker...");
				resetMIDIData();
				midiPlayer.terminate();
				if (restart) {
					setupMIDIWorker();
				}
			}
			midiPlayer.on("message", async message => {
				if (message.head == "end") {
					resetMIDIData();
					reset();
				}
				if (message.head == "error") {
					if (song.current.request) {
						qMsg(`Sorry, I'm having trouble playing #${song.current.id}.`);
					}
					deleteMIDI(song.current.id);
					reset(true);
				}
				if (message.head == "event") {
					let event = message.event;
					if (event.channel == 10) return;
					if (event.name == "Note off" || (event.name == "Note on" && event.velocity == 0)) {
						handleNote(convertNote(event.noteName));
					} else if (event.name == "Note on" && !isNoteLocked(event.noteName)) {
						let velocity;
						if (typeof event.velocity == "number") {
							let temp = event.velocity / 128 // 100;
							temp = Number(temp.toFixed(1));
							velocity = temp > 1 ? 1 : temp;
						} else {
							velocity = 1;
						}
						handleNote(convertNote(event.noteName), velocity);
					}
				}
			});
			midiPlayer.on("error", (error) => {
				if (error.code == "ERR_WORKER_OUT_OF_MEMORY") {
					if (song.playing) {
						if (song.current.request) qMsg(`Sorry, I'm having trouble playing #${song.current.id}.`);
					}
					reset(true);
				}
			});
		}

		setupMIDIWorker();

		const playMIDI = async (item) => {
			resetMIDIData();
			if (!song.midiWorkerActive) setupMIDIWorker();
			let files = await fs.promises.readdir(__dirname + "/midi");
			let midiFiles = files.filter(file => path.extname(file) === ".mid");
			let songs = editJsonFile("songs.json");
			let top = songs.data.index.filter(song => song.plays > 0).sort((a, b) => b.plays - a.plays).slice(0, 100);
			let useTop = top.length >= 100;
			let selected = useTop ? rando(top) : rando(midiFiles);
			if (selected.deleted) {
			 	playMIDI(item);
			  	return;
			}
		  
			let id = useTop ? selected.id : Number(selected.split(".mid")[0]);
			let file = useTop ? `${selected.id}.mid` : selected;
			if (!item) {
				item = {
					request: false
				}
			}

			if (item.id) id = item.id;
			if (item.file) file = item.file;

			if (!item.id) item.id = id;
			if (!item.file) item.file = file;
		  
			if (item.request) {
			  	songs.data.index[item.id].plays ++;
			  	songs.save();
			}

			song.current = { ...item, id, file };
			song.current.recording = false;
			song.playing = true;
			midiPlayer.postMessage({"head": "play", "item": item});
			if (song.changeDesiredChSettingsOnSong) song.useTempSettings = true;
			noteableTaskCount ++;
		}
		  

		const play = array => {
			resetMIDIData();
			let current = -1;
			song.playing = true;
			song.current.recording = true;
			let lastTime = Date.now().valueOf();
			let next = () => {
				current ++;
				let currentEvent = array[current];
				let delay = currentEvent.note.d || 0;
				let sameTimeNotes = [currentEvent]; // array to hold notes with the same timestamp
		
				// while there are more notes and the next note has the same timestamp + delay
				while (current + 1 < array.length && array[current + 1].time === currentEvent.time + delay) {
					current++;
					sameTimeNotes.push(array[current]);
				}
		
				// play all notes with the same timestamp + delay
				for (let noteEvent of sameTimeNotes) {
					let note = convertNote(noteEvent.note.n);
					if (noteEvent.note.v) {
						let velocity;
						if (typeof noteEvent.note.v == "number") {
							let temp = Number(noteEvent.note.v.toFixed(1));
							velocity = temp > 1 ? 1 : temp;
						} else {
							velocity = 1;
						}
						handleNote(note, velocity);
					} else {
						handleNote(note);
					}
				}
		
				if (!song.playing) current = array.length;
				if (current + 1 >= array.length) {
					resetMIDIData();
				} else {
					setTimeout(() => {
						lastTime = currentEvent.time;
						next();
					}, (currentEvent.time - lastTime) + delay);
				}
			}
			next();
			noteableTaskCount ++;
		}
	}

	const join = async () => {
		for (var i1 = 0; i1 < Object.keys(config.servers).length; i1++) {
			for (var i = 0; i < config.servers[Object.keys(config.servers)[i1]].length; i++) {
				let settings = config.servers[Object.keys(config.servers)[i1]][i].settings ? config.servers[Object.keys(config.servers)[i1]][i].settings : {};
				let ch = config.servers[Object.keys(config.servers)[i1]][i].name;
				let ws = Object.keys(config.servers)[i1];
				newInstance(ch, ws, settings);
				await timer(3000);
			}
		}
	}
	join();
}

const timer = ms => new Promise(res => setTimeout(res, ms));

var commandHelp = {};
let generatingHelp;

const generateHelpList = async () => {
	if (generatingHelp) return;
	generatingHelp = true;
	addToLog(moduleName, "Generating help list...");
	return new Promise((resolve, reject) => {
		let helpGenerator = new Worker ("./helpGenerator.js");	
		helpGenerator.postMessage("start");
		helpGenerator.on("message", message => {
			commandHelp = message;
			helpGenerator.terminate();
			generatingHelp = false;
			addToLog(moduleName, "Done generating help list.");
			resolve(true);
		});
	});
}

generateHelpList()

/* const importMIDI = (fileID, name) => {
	if (typeof fileID !== "number" || typeof name !== "string") return false;
	if (!fs.existsSync(`${__dirname}/midiToImport`) || !fs.existsSync(`${__dirname}/midiToImport/${fileID}.mid`) || !fs.existsSync(`${__dirname}/midinames.txt`)) return false;
	let filesToImport = [];
	fs.copyFileSync("midinames.txt", "midinamesBackup.txt");
	let midiNames = fs.readFileSync("midinames.txt", "utf8").split("\n");
	let importID = midiNames.length == 0 ? -1 : midiNames.length - 2 // substract 1 to account for the final \n at the end of the file
	filesToImport.push(`${fileID}.mid`);
	console.log(`Found ${filesToImport.length} MIDI files to import.`);
	return new Promise((resolve, reject) => {
		filesToImport.forEach((file) => {
			let wasError = false;
			try {
				importID ++;
				fs.copyFileSync(`${__dirname}/midiToImport/${file}`, `${__dirname}/midi/${importID}.mid`);
				fs.copyFileSync(`${__dirname}/midiToImport/${file}`, `${__dirname}/midiBackup/${importID} - ${name}.mid`);
				fs.unlinkSync(`${__dirname}/midiToImport/${file}`);
				fs.appendFileSync("midinames.txt", `${name}\n`);
				let fd = fs.createReadStream(`${__dirname}/midi/${importID}.mid`);
				let hash = createHash("md5");
				hash.setEncoding("hex");
				fd.on("end", () => {
		    		hash.end();
					let hashValue = hash.read();
					fs.appendFileSync("midihashes.txt", `${hashValue}\n`);
					resolve({ id: importID });
					console.log(`Imported ${name} as #${importID}.`);
				});
				fd.pipe(hash);
			} catch (error) {
				wasError = true;
				console.log(error);
				try {
					if (fs.existsSync(`${__dirname}/midiToImport/${fileID}.mid`)) fs.unlinkSync(`${__dirname}/midiToImport/${fileID}.mid`);
					if (fs.existsSync(`${__dirname}/midi/${importID}.mid`)) fs.unlinkSync(`${__dirname}/midi/${importID}.mid`);
					fs.copyFileSync(`midinamesBackup.txt`, `midinames.txt`);
				} catch (error) {
					console.log(error);
				}
			}
			if (wasError) {
				reject("error");
			}
		});
	});
} */

// This was used to generate the hashes before they existed:
const generateMIDIHashes = async () => {
    console.log("Generating MIDI hashes...");
    let files = [];
    let hashes = fs.readFileSync("midihashes.txt", "utf8").split("\n");
    let index = hashes.length == 0 ? -1 : hashes.length - 2;
    fs.readdirSync(`${__dirname}/midi`).forEach((file) => {
        files.push(`${file.split(".mid")[0]}`);
    });
    files = files.sort((a, b) => { return a - b });
    for (let file of files) {
        index++;
        // console.log(`Creating hash for ${file}...`);
        let fd = fs.createReadStream(`${__dirname}/midi/${file}.mid`);
        let hash = createHash("md5");
        hash.setEncoding("hex");
        await new Promise((resolve, reject) => {
            fd.on('end', () => {
                hash.end();
                let hashValue = hash.read();
                fs.appendFileSync("midihashes.txt", `${hashValue}\n`);
                resolve();
            });
            fd.on('error', reject);
            fd.pipe(hash);
        });
    }
}

// generateMIDIHashes();

const convertSongDB = async () => {
	let names = fs.readFileSync("midinames.txt", "utf8").replace(/\r/g, "").split("\n")
	let hashes = fs.readFileSync("midihashes.txt", "utf8").replace(/\r/g, "").split("\n")
	let songs = editJsonFile("songs.json");
	songs.data.index = [];
	let files = [];
	let index = -1;
	fs.readdirSync(`${__dirname}/midi`).forEach((file) => {
        files.push(file);
    });
	files = files.sort((a, b) => { return a - b });
	for (let file of files) {
		index ++;
		songs.data.index.push({
			"name": names[index],
			"hash": hashes[index],
			"id": index,
			"plays": 0
		});
	}
	songs.save();
}

let deleteMIDI = (fileID) => {
	if (typeof fileID !== "number") { return false; }
	if (!fs.existsSync(`${__dirname}/midiToImport`) || !fs.existsSync(`${__dirname}/midi/${fileID}.mid`) || !fs.existsSync(`${__dirname}/midi`)) { return false; }
	fs.unlinkSync(`${__dirname}/midi/${fileID}.mid`);
	let songs = editJsonFile("songs.json");
	if (songs.data.index[fileID]) songs.data.index[fileID].deleted = true; songs.data.index[fileID].hash = Math.random();
	songs.save();
	console.log(`Deleted MIDI #${fileID}`);
}

const importMIDI = (fileID, name) => {
	if (typeof fileID !== "number" || typeof name !== "string") return false;
	if (!fs.existsSync(`${__dirname}/midiToImport`) || !fs.existsSync(`${__dirname}/midiToImport/${fileID}.mid`) || !fs.existsSync(`${__dirname}/midi`)) return false;
	return new Promise((resolve, reject) => {
		let wasError = false;
		try {
			let songs = editJsonFile("songs.json");
			let fileToImport = `${fileID}.mid`;
			// look for deleted song IDs we can reuse:
			let reusableID = songs.data.index.findIndex((file) => file.deleted);
			let importID = reusableID !== -1 ? reusableID : songs.data.index.length;
			// send imported MIDI to backup:
			// no, screw the backup - fs.copyFileSync(`${__dirname}/midiToImport/${fileToImport}`, `${__dirname}/midiBackup/${importID} - ${name}.mid`);
			// generate file hash:
			let fd = fs.createReadStream(`${__dirname}/midiToImport/${fileToImport}`);
			let hash = createHash("md5");
			hash.setEncoding("hex");
			fd.on("end", () => {
		   		hash.end();
				let hashValue = hash.read();
				// finalize:
				fs.copyFileSync(`${__dirname}/midiToImport/${fileToImport}`, `${__dirname}/midi/${importID}.mid`);
				fs.unlinkSync(`${__dirname}/midiToImport/${fileToImport}`);
				songs.data.index[importID] = {
					name: name,
					hash: hashValue,
					id: importID,
					plays: 0
				};
				songs.save();
				resolve({ id: importID });
				console.log(`Imported ${name} as #${importID}.`);
			});
			fd.pipe(hash);
		} catch (error) {
			wasError = true;
			console.log(error);
			try {
				if (fs.existsSync(`${__dirname}/midiToImport/${fileID}.mid`)) fs.unlinkSync(`${__dirname}/midiToImport/${fileID}.mid`);
				if (fs.existsSync(`${__dirname}/midi/${importID}.mid`)) fs.unlinkSync(`${__dirname}/midi/${importID}.mid`);
			} catch (error) {
				console.log(error);
			}
		}
		if (wasError) {
			reject("error");
		}
	});
}

function howRude (text) {
    let samples = [
		// redacted
	];
	return Number((stringSimilarity.findBestMatch(text.toLowerCase(), samples).bestMatch.rating * 100).toFixed(1));
}

const performMaintenance = () => {
	addToLog(moduleName, "Starting maintenance check...");
	let config = editJsonFile("config.json");
	let date = Date.now().valueOf();
	if (!config.data.lastMaintenanceCheck) config.data.lastMaintenanceCheck = date; config.save();
	config.data.lastMaintenanceCheck = date; config.save();
	if (!config.data.lastTopSongReset) config.data.lastTopSongReset = date; config.save();
	if (date - config.data.lastTopSongReset >= 604800000) {
		config.data.lastTopSongReset = date;
		config.save();
		let songs = editJsonFile("songs.json");
		songs.data.index.forEach(song => {
			songs.data.index[song.id].plays = 0;
		});
		songs.save();
		addToLog(moduleName, "Reset song play count as per settings.");
	}
	addToLog(moduleName, "Done with maintenance check.");

}

// convertSongDB();

//importMIDI(5, "test");
//deleteMIDI(0);

/* let songs = editJsonFile(`${__dirname}/songs.json`);
			let i = -1;
	songs.data.index.forEach(song => {
	i ++;
	if (!song.plays) songs.data.index[i].plays++;
	// if (!song.id) songs.data.index[i].id = i;
});
songs.save(); */

			// let top100 = songs.data.index.sort((a, b) => b.plays - a.plays).splice(0, 100);*/

			// convertSongDB();


			

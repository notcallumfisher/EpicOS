// callum fisher - 2024.01.03

import pkg from "edit-json-file";
const editJsonFile = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { addToLog, setLogBossModuleName } from "./log.js";

const moduleName = "database";
setLogBossModuleName(moduleName);

// addToLog(moduleName, "Running.");

function valid_id (_id) {
	return _id.length == 24;
}

const database = {
	registered: function (_id) {
		return Object.keys(editJsonFile(`./db/${_id}.json`).data).length > 0;
	},
	register: async function(_id, name) {
		if (valid_id(_id)) {
			let timestamp = Date.now();
			let user = editJsonFile(`./db/${_id}.json`);
			user.set({
				"names": [name],
				"lastknownname": name,
				"rank": 1,
				"inventory": {
					"coin": {
						amount: 160
					}
				},
				"firstSeen": timestamp,
				"inbox": [],
				"lastClaim": Date.now(),
				"sendAwayMessage": true
			})
			user.save();
			addToLog(moduleName, `Registered: ${_id}, ${name}`);
		}
	},
	sendMessage: function (content, _id, senderId, senderName) {
		var user = editJsonFile(`./db/${_id}.json`);
		user.data.inbox.push({
			"date": Date.now(),
			"read": false,
			"told": false,
			"content": content,
			"sender": {
				"name": senderName,
				"_id": senderId
			}
		});
		user.save()
	},
	itemExists: function (item) {
		return fs.existsSync(__dirname+"/items/"+item+".js")
	},
	hasItem: function(item, _id) {
		if (!database.itemExists(item)) return false;
		return Object.keys(editJsonFile(`./db/${_id}.json`).data.inventory).includes(item) && editJsonFile(`./db/${_id}.json`).data.inventory[item].amount > 0
	},
	getInventory: function(_id) {
		return editJsonFile(`./db/${_id}.json`).data.inventory;
	},
	get: function(key, _id) {
		var user = editJsonFile(`./db/${_id}.json`);
		return user.get(key);
	},
	set: function(key, value, _id) {
		var user = editJsonFile(`./db/${_id}.json`);
		user.set(key, value);
		user.save();
	},
	giveItem: function(item, _id, amount) {
		var user = editJsonFile(`./db/${_id}.json`)
		if (database.hasItem(item, _id)) {
			user.data.inventory[item].amount += amount || 1;
		} else {
			if (database.itemExists(item)) user.data.inventory[item] = {
				amount: amount || 1
			}
		}
		user.save();
		addToLog(moduleName, `Gave ${amount || 1} to ${_id}`);
	},
	takeItem: function(item, _id, amount) {
		var user = editJsonFile(`./db/${_id}.json`)
		if (database.hasItem(item, _id)) {
			user.data.inventory[item].amount -= amount || 1;
			user.save();
		}
		addToLog(moduleName, `Taken ${amount || 1} from ${_id}`);
	}
}
	/*getItemInfo: function (item) {
		if (!database.itemExists(item)) return { desc: "What is this?", "value": "unknown"};
		var item = fs.readFileSync(__dirname+"/items/"+item+".js")
		return { desc: item.desc, value: item.value };
	},
	inStore: (item, _id) => {
		if (!database.itemExists(item)) return false;
		return Object.keys(editJsonFile(`./sale.json`).data.items).includes(item) && editJsonFile(`./sale.json`).data.items[item].amount > 0
	},
	addToStore: (item, _id, amount) => {
		var store = editJsonFile(`./sale.json`)
		if (database.hasItem(item, _id)) {
			store.data.items[item].amount += amount || 1
		} else {
			if (database.itemExists(item)) user.data.inventory[item] = {
				amount: amount || 1
			}
		}
		user.save();
	}*/

export default database;
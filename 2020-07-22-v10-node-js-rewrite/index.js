/*
	callum fisher - 2020.07.22
	index.js - This file acts a launcher for the application, by handling any missing essential files and then launching the main application.

	This is free and unencumbered software released into the public domain.

	Anyone is free to copy, modify, publish, use, compile, sell, or
	distribute this software, either in source code form or as a compiled
	binary, for any purpose, commercial or non-commercial, and by any
	means.

	In jurisdictions that recognize copyright laws, the author or authors
	of this software dedicate any and all copyright interest in the
	software to the public domain. We make this dedication for the benefit
	of the public at large and to the detriment of our heirs and
	successors. We intend this dedication to be an overt act of
	relinquishment in perpetuity of all present and future rights to this
	software under copyright law.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
	OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
	ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

	For more information, please refer to <https://unlicense.org/>
*/

// Dependencies ++
const log = require("./custom_modules/log.js")
const editjsonfile = require("edit-json-file")
const fs = require("fs")
// Dependencies --

const module_prefix = "[LAUNCHER]"

log.add(`${module_prefix} Running.`)

function launch() {
	require("./app.js")
}

log.add(`${module_prefix} Checking files.`)

// Check Configuration ++
config = editjsonfile("./config.json")
if (!fs.existsSync("./config.json")) {
	log.add(`${module_prefix} Created a configuration file.`)
	config.set("supportemail", "")
	config.set("mppurl", "https://www.multiplayerpiano.com")
	config.set("mppclientpath", "/Client.js")
	config.set("mppwsurl", "wss://www.multiplayerpiano.com:443")
	config.set("defaultchannel", "test")
	config.set("rejoinchannelattempts", 20)
	config.set("name", "EpicOS")
	config.save()
} else {
	log.add(`${module_prefix} Found configuration file.`)
}
// Check Configuration --

// Check Files ++
if (!fs.existsSync("./app.js")) {log.add(`${module_prefix} [ERROR] app.js is missing`);process.exit()}
if (!fs.existsSync("./Client.js")) {fs.writeFileSync("./Client.js", "");log.add(`${module_prefix} [WARNING] ./Client.js is missing (created a dummy file)`)}
if (!fs.existsSync("./storage")) {fs.mkdirSync("./storage");log.add(`${module_prefix} Created folder: ./storage`)}
if (!fs.existsSync("./storage/logs")) {fs.mkdirSync("./storage/logs");log.add(`${module_prefix} Created folder: ./storage/logs`)}
if (!fs.existsSync("./storage/userdb")) {fs.mkdirSync("./storage/userdb");log.add(`${module_prefix} Created folder: ./storage/userdb`)}
if (!fs.existsSync("./storage/cmdstats")) {fs.mkdirSync("./storage/cmdstats");log.add(`${module_prefix} Created folder: ./storage/cmdstats`)}
if (!fs.existsSync("./custom_modules/commands")) {fs.mkdirSync("./custom_modules/commands");log.add(`${module_prefix} Created folder: ./custom_modules/commands`)}
if (!fs.existsSync("./custom_modules/commands/help.js")) {log.add(`${module_prefix} [WARNING] help command is missing.`)}
// Check Files --

// Launch:
log.add(`${module_prefix} Done checking files. Launching now.`)
launch()

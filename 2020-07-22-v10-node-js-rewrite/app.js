/*
	callum fisher - 2020.07.22

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
const userdb = require("./custom_modules/userdb.js")
const fs = require("fs")
// Dependencies --

const module_prefix = "[APP]"

var tempdata = {
	rejoinchannelattempts: 0,
	intervals: {}
}

// Prepare EOS object:
var EOS = {
	config: require("./config.json"),
	functions: {}
}

EOS.functions.getMPPClient = function() {
	return new Promise(function(resolve, reject) {
		log.add(`${module_prefix} Downloading Client.js from ${EOS.config.mppurl+EOS.config.mppclientpath}`)
		fs.writeFileSync("./storage/old_Client.js", fs.readFileSync("./Client.js"))
		var file = fs.createWriteStream("./Client.js")
		var request = require(EOS.config.mppurl.includes("https") ? `https` : `http`).get(EOS.config.mppurl+EOS.config.mppclientpath, function(response) {
			response.pipe(file)
			response.on("end", function() {
				resolve()
				log.add(`${module_prefix} Downloaded Client.js from ${EOS.config.mppurl+EOS.config.mppclientpath}`)
			})
		})
	})
}

function launch() {
	Client = require("./Client.js")
	EOS.client = new Client(EOS.config.mppwsurl)
	EOS.client.start()
	if (EOS.config.defaultchannel !== "") {
		EOS.desiredchannel = EOS.config.defaultchannel
		EOS.client.setChannel(EOS.config.defaultchannel)
		log.add(`${module_prefix} Desired channel: ${EOS.config.defaultchannel}`)
	} else {
		// bot will find channel automatically eventually:
		EOS.client.setChannel("bob")
		log.add(`${module_prefix} Desired channel: ${EOS.config.defaultchannel}`)
	}
	tempdata.intervals.channelint = setInterval(function() {
		if (EOS.client.channel._id !== EOS.desiredchannel) { // if bot not in desired channel:
			if (tempdata.rejoinchannelattempts !== EOS.config.rejoinchannelattempts) { // if haven't reach max rejoin channel attempts, retry:
				tempdata.rejoinchannelattempts++
				log.add(`${module_prefix} In channel "${EOS.client.channel._id}" instead of "${EOS.desiredchannel}". Attempting to rejoin. (${tempdata.rejoinchannelattempts}/${EOS.config.rejoinchannelattempts})`)
			}
		} else {
			tempdata.rejoinchannelattempts = 0
		}
	}, 2000)
}

EOS.functions.getMPPClient().then(function() {
	launch()
})


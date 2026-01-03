/*
	callum fisher - 2015 - 2024.12.20

	This is the original 2015 web browser version of EpicOS. I have:
	- Corrected some typos
	- Removed Squid's name collector script
	Other than that, the original (bad) code structure remains.

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

let cmdChar = "/";
let selfId2 = MPP.client.getOwnParticipant()._id; // Your _ID on Multiplayer Piano

MPP.client.setChannel("lolwutsecretlobbybackdoor");

MPP.chat.send('EpicOS is now active. Type /help for the command list.');

MPP.client.on("a", function (msg) {
var cmds = ['help', 'lol', 'test', 'say (Word or sentence.)','encode (Encode text)','decode (Decode encoded text.)','myinfo (Gets your _id, id and other user info.)','8ball (WIP command.)','info (Shows info about this bot.)'];
var commands = cmdChar+cmds[0];
   for (i = 1; i < cmds.length; i++) {
   commands += ", "+cmdChar+cmds[i]; }

if (cmd == cmdChar+"help") { MPP.chat.send('✨✨EpicOS commands: ' + commands + '✨✨'); }

});

MPP.client.on("a", function(msg) { if( msg.a == cmdChar + "test") MPP.chat.send( msg.p.name + ', the bot is active and working correctly!'); });

MPP.client.on("a", function(msg) { if( msg.a == cmdChar + "myinfo") MPP.chat.send( msg.p.name + ', your id is ' + msg.p.id + ', your _id is ' + msg.p._id + ', the length of your name (' + msg.p.name + ') is ' + msg.p.name.length + ' characters long, your color in hex is ' + msg.p.color + ', your color name is ' + new Color(msg.p.color).getName().toLowerCase() + ' .Thats all the information i have.'); });

MPP.client.on("a", function(msg) { if( msg.a == cmdChar + "lol") MPP.chat.send( msg.p.name + ' laughs so hard he/she begins to choke. *Hands ' + msg.p.name +  ' a glass of water.*'); });

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if (cmd == cmdChar+"say") { if (input == "") { MPP.chat.send("Please enter a word/sentence for me to say! :P") } else if (input.indexOf(cmdChar+"say") == 0) { MPP.chat.send("Not today.") } else { MPP.chat.send(input) }}});


//Below are just the responses for the 8ball command
var ball = ['XD LOL.No.', 'Hell no!', 'bitch u stupid or something??? XD Lol no', 'never','maybe idk','go away pls']; 


MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if (cmd == cmdChar+"8ball") { if (input == "") { MPP.chat.send("Please input something for the 8ball to reply to! :P (8ball <Statement/Question/Word>)") }  else {  var ball1 = Math.floor(Math.random() * ball.length); MPP.chat.send('The 8ball says: '+ball[ball1]+'.');  }}});



var selfId = MPP.client.getOwnParticipant()._id; MPP.client.on("a", function(msg) { if (msg.a.split(' ')[0] == "hi" || msg.a.split(' ')[0] == "hey" || msg.a.split(' ')[0] == "hello") { if (msg.p._id == selfId) {} else { MPP.chat.send('EpicOS: Hi there, ' + msg.p.name + '!, how may i help you?') } }})

MPP.client.on("participant added", function(msg){ if (welcome){ MPP.chat.send('Welcome, ' + msg.name + ' do feel free to try out a few of my commands with ' + cmdChar + 'help!'); } });




function binary(text) { var output = ""; var input = text; for (i=0; i < input.length; i++) { var e=input[i].charCodeAt(0);var s = ""; do{ var a =e%2; e=(e-a)/2; s=a+s; } while(e!=0); while(s.length<8){s="0"+s;} output+=s + " "; } return output; }

function info(name){ for (var pl in MPP.client.ppl){ if (MPP.client.ppl[pl].name.toLowerCase().contains(name.toLowerCase())){ return MPP.client.ppl[pl]; } } }

function encode(text) { return window.btoa(unescape(encodeURIComponent(text))); }

function decode(text){ return decodeURIComponent(escape(window.atob(text))); }

                                         
// MPP.client.on('a', m => { if (m.p._id == "") { if (m.a.startsWith("/p")) { MPP.chat.send("/stop") } } });

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if (cmd == cmdChar+"encode") { if (input == "") { MPP.chat.send("Please input something for me to encode! ") }  else {  MPP.chat.send('Encoded: ' + encode(input) + '.');  }}});

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if (cmd == cmdChar+"decode") { if (input == "") { MPP.chat.send("Please input something for me to decode! ") }  else {  MPP.chat.send('Decoded: ' + decode(input) + '.');  }}});

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if (cmd == cmdChar+"decode") { if (input == "") { MPP.chat.send("Please input something for me to convert to binary! ") }  else {  MPP.chat.send('Binary: ' + binary(input) + '.');  }}});

//if (msg.p._id == selfId) {  }

MPP.client.on("a", function(msg) { if( msg.a == cmdChar + "welcome off") if (msg.p._id == selfId2) { MPP.chat.send('Welcome messages were disabled.'); delete welcome } else { MPP.chat.send('Sorry, this command is owner only.') } });


MPP.client.on("a", function(msg) { if( msg.a == cmdChar + "welcome on") if (msg.p._id == selfId2) { MPP.chat.send('Welcome messages were enabled.'); welcome = "1" } else { MPP.chat.send('Sorry, this command is owner only.') } });




MPP.client.on("a", function(msg) { if( msg.a == cmdChar + "clear") if (msg.p._id == selfId2) { MPP.chat.clear();MPP.chat.send('For those that care (Which i can guarantee would be nobody.), the chat was cleared locally.');} else { MPP.chat.send('Sorry, this command is owner only.') } });

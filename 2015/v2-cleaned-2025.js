/*
	callum fisher - 2015 - 2025.01.01

	This is version 2 of the web browser version of EpicOS. I have:
	- Corrected some typos
	- Removed (some) bloat including some external scripts
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


//Basic settings
cmdChar = '^';
battery = 100;
botname = 'EpicOS';
batterything = true;
batterything1 = true;
batterything2 = true;
batterything3 = true;
infinitebattery = false;
batteryname = true;
batteryenabled = true;
chargecommand = true;
searchHistory = []
//Basic settings



setInterval(function(){ if(batteryenabled) { infinitebattery = false; batteryname = true; chargecommand = true } else { infinitebattery = true; batteryname = false; chargecommand = false; } }, 5000);

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "charge") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { if(chargecommand) { if(battery == 100) { MPP.chat.send( error + 'Unable to charge: Battery is full.'); } else { MPP.chat.send('Battery charged to 100%'); batterything = true;
batterything1 = true;
batterything2 = true;
batterything3 = true; battery = 100; googleCommand = true } } else { MPP.chat.send(error + 'Command not active. The bots battery mode is disabled.') } } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "secrets") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('The cake is a lie. The cake is a lie. The cake is a lie. The cake is a lie. The cake is lie.') } else {  } } });

setInterval(function(){ if(batteryname) { MPP.client.sendArray([{ m: "userset", set: { name: botname + ' [' + cmdChar + 'help] Battery: ' + battery + '%'  } }]); } else { MPP.client.sendArray([{ m: "userset", set: { name: botname + ' [' + cmdChar + 'help]'  } }]); } }, 1000);

//The cake is a lie. The cake is a lie. The cake is a lie. The cake is a lie. The cake is a lie.
//The cake is a lie. The cake is a lie. The cake is a lie. The cake is a lie. The cake is a lie.
//The cake is a lie. The cake is a lie. The cake is a lie. The cake is a lie. The cake is a lie.

setInterval(function(){ if(batterything) {  if(battery < 30 == true) { MPP.chat.send('Warning! Battery is low! Use ' + cmdChar + 'charge to charge the battery. Due to low power, some commands have been disabled.'); batterything = false; googleCommand = false } } }, 2000);
setInterval(function(){ if(batterything1) { battery = battery - 1; } }, 30000);
setInterval(function(){ if(batterything2) { if(battery < 15 == true) { MPP.chat.send('Warning! Battery is at 15% Use ' + cmdChar + 'charge to charge the battery now!'); batterything2 = false } } }, 2000);
setInterval(function(){ if(batterything3) { if(battery < 0 == true) { MPP.chat.send('Warning! Battery is at 0% Shutting down system.. To reactivate the bot, an admin must type ' + cmdChar + 'js resetBattery()'); Power = 'off'; batterything3 = false; batterything2 = false; batterything = false; batterything1 = false} } }, 2000);
setInterval(function(){ if(infinitebattery) { battery = 100; batterything1 = false; } else { batterything1 = true } }, 2000);

function test() { MPP.chat.send('Awww, ' + meow().toUpperCase() + ' LOVES ' + meow().toUpperCase() + '!') }

function tumblr(stringystring) {
	// redacted
}

// to use: run
// tumblr("string");
notecount = 0; MPP.client.on('n',a=>notecount+=a.n.length);
botname = 'undefined';
cmdChar = 'undefined';
var speakChat = false;  
function rbinary(bin){ array = bin.split(" "); var result = ""; for (var i = 0; i < array.length; i++) { result += String.fromCharCode(parseInt(array[i], 2)); } return result; }

MPP.client.on("a", function (msg) {
     var args = msg.a.split(" ");
        var cmd = args[0].toLowerCase();
        args = args.slice(1);
        var sendChat = function(msg) { MPP.chat.send(msg) };
        var name = msg.p.name;
       
        if (speakChat) {
        var t = new SpeechSynthesisUtterance();
            t.text = msg.a.slice(0, 512);
                  t.lang = 'en-GB';
                  t.rate = 0.75;
                  t.pitch = 1.0;
                  t.volume = 2.0;
                  speechSynthesis.speak(t); 
		}
	}); 

msgcount = 1 
MPP.client.on("a", function(msg) { msgcount = msgcount + 1 });

var i = 1;
function spam () {
   // redacted
}

//Settings
cmdChar = '^';
Power = 'on';
botname = "EpicOS";
ownerId = "" ;
ownerName = "";
cmdChar = localStorage.lastcmdChar ;
botname = localStorage.lastbotname ;
localStorage.ownerName = ownerName ; 
suggestioncounter = 0 ;
banned = [] ;
msgcount = 1 ;
statscount = 0 ;
leavecount = 0 ;
joincount = 0 ;
blNames = ["Socket","LOL","Spammer","Proxy"];
autobanned = []
thingy = 0
var ballresponses = ['XD LOL. No.', 'Hell no!', 'bitch u stupid or something???', 'never','maybe idk','go away pls','Dunno','Hell yea!','Yea','Yep','Nah','Sorry im not home right now','no','YES','Fat chance','Lol fat chance','I dont think so!','Not this time!','i aint talking to YOU!','Yea sure whatever ','whatever','Suuuree','Maybe so',':P','In the year 3000 you will','just 3 seconds','Lel hell no!','nah m8','Definitely!','Duhhhh, yes!','what do you think','of course... NOT','of course!','Duhh','XD NO','no','yes','m8','doubt it','Tomorrow','Ughhh im tired can you ask again some other time??','TrY AgAiN wHeN i CaRe!','TrY aGaIn!','i hate you','UGH NO','google it','m8 i may be a computer but i dont know everything!','[The number you are calling does not give a fuck]','k'];  
var getResponse = ballresponses[Math.floor(Math.random() * ballresponses.length)];  
admins = [];
var diceresponses = ['1','6','3','5','2','4'];
var diceresponse = diceresponses[Math.floor(Math.random() * diceresponses.length)];  
var Operators = ['+','-','/','*'];
var getOperator = Operators[Math.floor(Math.random() * Operators.length)]; 
correctanswercount = 0 ;
welcome = false ;
news = 'Got an idea for EpicOS? Try out the suggest command!' ;
news2 = 'Bored? Why not use the games command?' ;
afkusersids = [];
afkusersnames = [];
//Settings
MPP.chat.send('EpicOS is now active. For the command list, type ' + cmdChar + 'help.');

	var googleCommand = true;
	var googleCommandDelay = 3;
	
	// redacted google search code


MPP.client.on("a", function(msg) { if(blNames.includes(msg.p.name) == true )  { if(autobanned.includes(msg.p._id) == true) {  } else { MPP.chat.send('User with the id (' + msg.p._id + ') has been added to the ban list. Reason: Autobanned by system, that name is blacklisted.'); autobanned.push(msg.p._id); banned.push(msg.p._id) } } });

MPP.client.on("participant added", function(msg) { leavecount = leavecount + 1 });
MPP.client.on("participant added", function(msg) { joincount = joincount + 1 });




function binary(text) { var output = ""; var input = text; for (i=0; i < input.length; i++) { var e=input[i].charCodeAt(0);var s = ""; do{ var a =e%2; e=(e-a)/2; s=a+s; } while(e!=0); while(s.length<8){s="0"+s;} output+=s + " "; } return output; }


function encode(text) { return window.btoa(unescape(encodeURIComponent(text))); }

function decode(text){ return decodeURIComponent(escape(window.atob(text))); }

                                         
// MPP.client.on('a', m => { if (m.p._id == "") { if (m.a.startsWith("/p")) { MPP.chat.send("/stop") } } });



MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"encode") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (input == "") { MPP.chat.send('Please input something for me to encode! ') }  else {  MPP.chat.send('Encoded: ' + encode(input) + '');  }}}}});

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if(Power == "on" == true) { if (cmd == cmdChar+"google") { if( googleCommand == true ){ if (input == "") { MPP.chat.send('Please input something for me google!') }  else { MPP.chat.send('[GOOGLE] Processing request..'); lastsearch = input; Power = 'off'; searchHistory.push(lastsearch); setTimeout(function(){ gcseCallback(input); Power = 'on'}, 4000); }}}}}});


MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"decode") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (input == "") { MPP.chat.send("Please input something for me to decode! ") }  else {  MPP.chat.send('Decoded: ' + decode(input) + '');  }}}}});

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"translatetobinary") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (input == "") { MPP.chat.send("Please input something for me to translate.") }  else {  MPP.chat.send('Translated: ' + binary(input) + '.');  }}}}});

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"translatefrombinary") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (input == "") { MPP.chat.send("Please input something for me to translate.") }  else {  MPP.chat.send('Translated: ' + rbinary(input) + '.');  }}}}});


MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if(Power == "on" == true) { if (cmd == cmdChar+"suggest") { if (input == "") { MPP.chat.send("Please input something for me to add to the suggestion list! ") }  else { localStorage.suggestions = localStorage.suggestions + ' _ ' + input + ', Suggested by ' + msg.p.name; suggestioncounter = suggestioncounter + 1 ; MPP.chat.send('(Suggestion #' + suggestioncounter + ') Thank you! Your suggestion has been saved. ' + '(' + input + ', Suggested by ' + msg.p.name + ', with the _id ' + msg.p._id + ')');  }}}}});

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "help") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('Public commands: ' + cmdChar + 'help, ' + cmdChar + 'about, ' + cmdChar + 'translatetobinary, ' + cmdChar + 'encode, ' + cmdChar + 'decode, ' + cmdChar + 'google, ' + cmdChar + 'suggest, ' + cmdChar + 'stats, ' + cmdChar + 'shout, ' + cmdChar + 'myinfo, ' + cmdChar + 'bans, ' + cmdChar + 'games, ' + cmdChar + 'yes, ' + cmdChar + 'no, ' + cmdChar + 'navyseals, ' + cmdChar + 'translatefrombinary, ' + cmdChar + 'amiadmin, ' + cmdChar + 'afk, ' + cmdChar + 'ayy-lmao');  if(admins.includes(msg.p._id) == true) { MPP.chat.send('Admin commands: ' + cmdChar + 'power, ' + cmdChar + 'welcome, ' + cmdChar + 'js, ' + cmdChar + 'tsunami, ' + cmdChar + 'ban, ' + cmdChar + 'unbanall, ' + cmdChar + 'relocate, ' + cmdChar + 'prefix, ' + cmdChar + 'rename, ' + cmdChar + 'test, ' + cmdChar + 'settings, ' + cmdChar + 'news, ' + cmdChar + 'battery'); } MPP.chat.send('[NEWS/EXTRA] ' + news ); MPP.chat.send('[NEWS/EXTRA] ' + news2 ); } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "games") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('Games: ' + cmdChar + '8ball, ' + cmdChar + 'dice, ' + cmdChar + 'timetables, ' + cmdChar + 'rockpaperscissors (' + cmdChar + 'rps)'); } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "amiadmin") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { if(admins.includes(msg.p._id) == true) { MPP.chat.send('Yes, you are an admin of EpicOS.') } else { MPP.chat.send('No, you are not an admin of EpicOS.') } } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "dice") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { var diceresponse = diceresponses[Math.floor(Math.random() * diceresponses.length)]; MPP.chat.send( msg.p.name + ' rolled the dice and got: ' + diceresponse + ' out of 6!'); } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "yes") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('No'); } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "no") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('Yes'); } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "ownerhelp") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('Owner commands: ' + cmdChar + 'disconnect, ' + cmdChar + 'restart, ' + cmdChar + 'save, ' + cmdChar + 'texttospeech, ' + cmdChar + 'default'); } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "about") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('EpicOS - type ' + cmdChar + 'help for a list of commands.' ); } else {  } } });


MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "stats") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { statscount = statscount + 1; MPP.chat.send('Since the last system reboot, ' + notecount + ' notes have been pressed, ' + msgcount + ' messages have been sent, the stats command has been used ' + statscount + ' time(s), ' + joincount + ' person(s) have joined, and ' + leavecount + ' person(s) have left.');} else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "tsunami") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '') ) {
	MPP.chat.send('TSUNAMI INCOMING!!');
        // redacted
   } else { MPP.chat.send( securityerror + accessdenied ) } } });

securityerror = "Security error: "
error = "Error: "
accessdenied = 'Access was denied, sorry for any inconvenience caused. If you are certain you are an admin of EpicOS, please speak to the creator of EpicOS and try again.'

//adduserid = ""; admins = admins + ',' + adduserid + ''; MPP.chat.send('Added user to //the admin list. (' + adduserid + ')');

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "power on") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '') ) { MPP.chat.send('EpicOS is now online. Public commands were enabled. Type ' + cmdChar + 'help for the command list.'); localStorage.lastcmdChar = cmdChar;  Power = "on" } else { MPP.chat.send( securityerror + accessdenied ) } } }); 

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "power off") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '') ) { MPP.chat.send('EpicOS is now offline. Public commands were disabled.'); localStorage.lastcmdChar = cmdChar; localStorage.lastbotname = botname; Power = "off" } else { MPP.chat.send( securityerror + accessdenied ) } } }); 

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "power") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '') ) { MPP.chat.send('Usage: ' + cmdChar + 'power [on/off] (User: ' + msg.p.name + ')' ); } else { MPP.chat.send( securityerror + accessdenied ) } } });


MPP.client.on("participant added", function(msg){ if (welcome){ MPP.chat.send('Welcome to ' + MPP.client.channel._id + ', ' + msg.name + '! do feel free to try out a few of my commands with ' + cmdChar + 'help!'); } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "welcome on") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '') ) { MPP.chat.send('Welcome messages are now enabled. (User: ' + msg.p.name + ')'); welcome = true } else { MPP.chat.send( securityerror + accessdenied ) } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "welcome off") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '') ) { MPP.chat.send('Welcome messages are now disabled. (User: ' + msg.p.name + ')'); welcome = false } else { MPP.chat.send( securityerror + accessdenied ) } } });


MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "welcome") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '') ) { MPP.chat.send('Usage: ' + cmdChar + 'welcome [on/off] (User: ' + msg.p.name + ')'); delete welcome } else { MPP.chat.send( securityerror + accessdenied ) } } });


MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "disconnect") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( ownerId == msg.p._id == true ) { MPP.chat.send('Disconnecting EpicOS system, please wait..'); Power = "off"; delete welcome ; MPP.client.stop() } else { MPP.chat.send( securityerror + 'Sorry, this command is for the bot owner only.' ) } } });


MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "restart") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( ownerId == msg.p._id == true ) { setTimeout(function(){ MPP.chat.send('Restarting EpicOS system..'); Power = "off" }, 2000);
setTimeout(function(){ MPP.chat.send('Disconnecting'); MPP.client.stop() }, 4000);
setTimeout(function(){ MPP.client.start() }, 16000);
setTimeout(function(){ ; }, 20000);
setTimeout(function(){ MPP.chat.send('Connected');MPP.chat.send('EpicOS has successfully restarted. For the command list, type ' + cmdChar + 'help.'); Power = "on" }, 25000); } else { MPP.chat.send( securityerror + 'Sorry, this command is for the bot owner only.' ) } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "save") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( ownerId == msg.p._id == true ) { MPP.chat.send('Settings were saved.'); localStorage.lastcmdChar = cmdChar; localStorage.lastbotname = botname; } else { MPP.chat.send( securityerror + 'Sorry, this command is for the bot owner only.' ) } } });


MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"ban") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '')) { if (input == "") { MPP.chat.send(error + 'Failed to ban user: Incorrect use. Usage: ' + cmdChar + 'Ban [Users _id here.]') }  else { MPP.chat.send('Banning user.. (' + input + ')');if( input.length == 24 == false) { MPP.chat.send( error + 'Failed to ban user: Please use someones _id. That is not an _id!'); } else { if ( input == ownerId == true ) { MPP.chat.send( error + 'Failed to ban user: You cannot ban the owner.'); } else { if ( admins.includes(input) == true ) { MPP.chat.send( error + 'Failed to ban user: You cannot ban an admin.'); } else { if ( banned.includes(input) == true ) { MPP.chat.send( error + 'Failed to ban user: This id was already found in the ban list.') } else { setTimeout(function(){ MPP.chat.send('User with the id (' + input + ') has been added to the ban list. Please note that whenever the system restarts, the banned user list will be reset.'); banned.push(input) }, 2000); }}}}}}}}}});

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "unbanall") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '')) { MPP.chat.send('Unbanned all users.'); banned = [] } else { MPP.chat.send( securityerror + accessdenied ) } } });


MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"shout") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (input == "") { MPP.chat.send('Please input something for me to shout!') }  else {  MPP.chat.send('͏' + input.toUpperCase() + '!!');  }}}}});

function info(name){
		var array = [];
		for (var pl in MPP.client.ppl){
			if (MPP.client.ppl[pl].name.toLowerCase().contains(name.toLowerCase())){
				array.push(MPP.client.ppl[pl]);
			}
		}
		return array[Math.floor(Math.random() * array.length)];
	}
	
	function follow(part){
		intervalId2 = setInterval(function(){
			MPP.client.sendArray([{m: "m", x: part.x, y: part.y}]);
		},50);
	}
	
	function circleFollow(part){
		// redacted
	}

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "myinfo") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send( msg.p.name + ', your id is ' + msg.p.id + ', your _id is ' + msg.p._id + ', the length of your name (' + msg.p.name + ') is ' + msg.p.name.length + ' characters long, your color in hex is ' + msg.p.color + ', your color name is "' + new Color(msg.p.color).getName().toLowerCase() + '". Thats all the information i have.'); } else {  } } });

                               
MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "bans") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { if ( banned.length == 0 ) { MPP.chat.send( error + 'No users are currently banned.') } else { MPP.chat.send('Banned users: ' + banned ); } } else {  } } });                                                 


MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"8ball") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (input == "") { MPP.chat.send("Please input a question for the 8ball to answer to.") }  else { var getResponse = ballresponses[Math.floor(Math.random() * ballresponses.length)]; MPP.chat.send('The 8ball says: "' + getResponse + '"')
 }}}}});


MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"relocate") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if( admins.includes('' + msg.p._id + '') == true ) { if (input == "") { MPP.chat.send('Please enter a room name for me to relocate to!') }  else {  MPP.chat.send('Relocating to room: ' + input + '.'); MPP.client.setChannel(input)
; MPP.chat.send('[Connected to room: ' + input + '] Hi! im EpicOS! For the command list, type ' + cmdChar + 'help.')  }}}}}});


MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"prefix") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if( admins.includes('' + msg.p._id + '') == true ) { if (input == "") { MPP.chat.send('Nice try, however the prefix cannot be set to nothing.') }  else {   MPP.chat.send('The prefix has now been set to "' + input + '"' + '! For a list of commands, type ' + input + 'help.'); cmdChar = input  }}}}}});

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"rename") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if( admins.includes('' + msg.p._id + '') == true ) { if (input == "") { MPP.chat.send('My name cannot be nothing!') }  else { MPP.chat.send('The system has been renamed to ' + input + '.'); botname = input  }}}}}});


MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "texttospeech") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( ownerId == msg.p._id == true ) { MPP.chat.send('Usage: ' + cmdChar + 'texttospeech [On/Off]');  } else { MPP.chat.send( securityerror + 'Sorry, this command is for the bot owner only.' ) } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "texttospeech on") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( ownerId == msg.p._id == true ) { MPP.chat.send('Text-to-speech is now enabled.'); speakChat = true } else { MPP.chat.send( securityerror + 'Sorry, this command is for the bot owner only.' ) } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "texttospeech off") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( ownerId == msg.p._id == true ) { MPP.chat.send('Text-to-speech is now disabled.'); speakChat = false } else { MPP.chat.send( securityerror + 'Sorry, this command is for the bot owner only.' ) } } });




MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "navyseals") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('What the fuck did you just fucking say about me, you little bitch? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can '); MPP.chat.send('get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to '); MPP.chat.send('the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your crappy little “clever” comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You’re fucking dead, kiddo.') } else {  } } });

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"timetables") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { test = Math.random(); test2 = test * 20 ; RN = Math.floor(test2);  Lol = Math.random(); Lol2 = Lol * 20 ; RN2 = Math.floor(Lol2); var getOperator = Operators[Math.floor(Math.random() * Operators.length)]; Question = RN + ' ' + '*' + ' ' + RN2 ; Answer = RN * RN2 ; MPP.chat.send('[MATH]: What is ' + RN + ' ' + '*' + ' ' + RN2 + '? (Answer using ' + cmdChar + 'answer <Answer>)' );  }}}});

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"answer") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if( input == Answer ) { correctanswercount = correctanswercount + 1 ; MPP.chat.send('Correct! ' + msg.p.name + ' answered correctly with ' + input + '! So far ' + correctanswercount + ' questions have been answered correctly.'); Question = '[No question has been set. Use the timetables command to start playing.]' ; Answer = '[No question has been set. Use the timetables command to start playing.]' } else { MPP.chat.send('Your answer was incorrect, ' + msg.p.name + '! The question was: ' + Question + '.');  } }}}});

 MPP.client.on("a", function (msg) { if( botname == 'undefined' == true ) { MPP.chat.send( error + 'failed to load the bots name. Do /js botname = "EpicOS" and then /save to fix the problem.') } });

MPP.client.on("a", function (msg) { if( cmdChar == 'undefined' == true ) { MPP.chat.send( error + 'failed to load the bots cmdChar.') } });

function info(name){ for (var pl in MPP.client.ppl){ if (MPP.client.ppl[pl].name.toLowerCase().includes(name.toLowerCase())){ return MPP.client.ppl[pl]; } } }

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar ) if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send('How may i help you, ' + msg.p.name + '? If you are looking for the command list, try ' + cmdChar + 'help.'); } else {  } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "afk") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" == true) { MPP.chat.send( msg.p.name + ' is now marked as afk. Send any message to be unmarked.');  setTimeout(function(){ afkusersnames.push(msg.p.name); afkusersids.push(msg.p._id); }, 2000); } else {  } } });

MPP.client.on("a", function(msg) { if(afkusersids.includes(msg.p._id)) { MPP.chat.send('Welcome back, ' + msg.p.name + ', i have now removed you from the afk list.'); afkusersids.splice(msg.p._id); afkusersnames.splice(msg.p.name); } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "settings") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( admins.includes('' + msg.p._id + '') ) { MPP.chat.send('Settings: The current prefix is ' + cmdChar + '. The current bot name is ' + botname + '. Public commands are ' + Power + '. Text to speech: ' + speakChat + '. The current news: ' + news + ', ' + news2 + '. ADMIN: To change the prefix: ' + cmdChar + 'prefix <Prefix here> To rename the bot: ' + cmdChar + 'rename <Name here> To power the bot on/off: ' + cmdChar + 'power <On/Off> To change the news: ' + cmdChar + 'news <News here>'); MPP.chat.send('Welcome messages: ' + welcome + ' To enable/disable welcome messages: ' + cmdChar + 'welcome [On/Off]'); MPP.chat.send('OWNER: To enable/disable the text-to-speech feature: ' + cmdChar + 'texttospeech <On/Off> To default all settings: ' + cmdChar + 'default')  } else { MPP.chat.send( securityerror + accessdenied ) } } });

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"news") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if( admins.includes('' + msg.p._id + '') == true ) { if (input == "") { MPP.chat.send('Usage: ' + cmdChar + 'news <Whatever you want here>') }  else { MPP.chat.send('The news has been updated from ' + news + ' to ' + input ); news = input }}}}}});

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"news2") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if( admins.includes('' + msg.p._id + '') == true ) { if (input == "") { MPP.chat.send('Usage: ' + cmdChar + 'news <Whatever you want here>') }  else { MPP.chat.send('The news has been updated from ' + news2 + ' to ' + input ); news2 = input }}}}}});


MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "default") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if ( ownerId == msg.p._id == true ) { MPP.chat.send('Settings have been reset to defaults.'); cmdChar = '^';
Power = 'on';
botname = "EpicOS";
ownerId = "" ;
ownerName = "";
cmdChar = localStorage.lastcmdChar ;
botname = localStorage.lastbotname ;
localStorage.ownerName = ownerName ; 
suggestioncounter = 0 ;
banned = [] ;
msgcount = 1 ;
statscount = 0 ;
leavecount = 0 ;
joincount = 0 ;
blNames = ["Socket","LOL","Spammer","Proxy"];
autobanned = []
thingy = 0
var ballresponses = ['XD LOL. No.', 'Hell no!', 'bitch u stupid or something???', 'never','maybe idk','go away pls','Dunno','Hell yea!','Yea','Yep','Nah','Sorry im not home right now','no','YES','Fat chance','Lol fat chance','I dont think so!','Not this time!','i aint talking to YOU!','Yea sure whatever ','whatever','Suuuree','Maybe so',':P','In the year 3000 you will','just 3 seconds','Lel hell no!','nah m8','Definitely!','Duhhhh, yes!','what do you think','of course... NOT','of course!','Duhh','XD NO','no','yes','m8','doubt it','Tomorrow','Ughhh im tired can you ask again some other time??','TrY AgAiN wHeN i CaRe!','TrY aGaIn!','i hate you','UGH NO','google it','m8 i may be a computer but i dont know everything!','[The number you are calling does not give a fuck]','k'];  
var getResponse = ballresponses[Math.floor(Math.random() * ballresponses.length)];  
admins = [];
var diceresponses = ['1','6','3','5','2','4'];
var diceresponse = diceresponses[Math.floor(Math.random() * diceresponses.length)];  
var Operators = ['+','-','/','*'];
var getOperator = Operators[Math.floor(Math.random() * Operators.length)]; 
correctanswercount = 0 ;
welcome = false ;
news = 'Got an idea for EpicOS? Try out the suggest command!' ;
news2 = 'Bored? Why not use the games command?' ;
afkusersids = [];
afkusersnames = []; } else { MPP.chat.send( securityerror + 'Sorry, this command is for the bot owner only.') } } });

MPP.client.on("a", function(msg) { if( msg.a.toLowerCase() == cmdChar + "ayy-lmao") if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (Power == "on" ==  true) { sendChat("░█▀▀█ ▒█░░▒█ ▒█░░▒█ 　 ▒█░░░ ▒█▀▄▀█ ░█▀▀█ ▒█▀▀▀█ "); setTimeout(function () { sendChat("▒█▄▄█ ▒█▄▄▄█ ▒█▄▄▄█ 　 ▒█░░░ ▒█▒█▒█ ▒█▄▄█ ▒█░░▒█ "); }, 300); setTimeout(function () { sendChat("▒█░▒█ ░░▒█░░ ░░▒█░░ 　 ▒█▄▄█ ▒█░░▒█ ▒█░▒█ ▒█▄▄▄█ "); }, 400); } else {  } } });

function retardMode() { MPP.chat.send('Retard mode is now activated. To disable, reset the system.'); cmdChar = 'helphelp'; setTimeout(function () { MPP.chat.send( tumblr('EpicOS, created by undefined, is now active (Retard edition) for command list type ') + cmdChar + 'help'); }, 4000);   botname = 'NaN'; error = 'o noes! error occured!!!!!:::'; securityerror = 'no u no do that!'; accessdenied = 'u no admin access denyeed!!' ; admins = []; ownerId = ''; joincount = '66666666'; news = 'n0 news has ben set!! ';news2 = 'no00 neWs has beeN set!)'; };

function banall() { MPP.chat.send('The bot is now useless, as all users have been added to the ban list :))))'); banned = MPP.client.ppl }

words1 = [
	// redacted
];
objects = ['chair','wine glass','metal pole','door','plate']; 

function generateWord() { MPP.chat.send('Randomly generated word: ' + randomWord() + randomWord() + randomWord() + '.')  } 
function randomWord() { return words1[Math.floor(Math.random() * words1.length)]; }; 

function meow() { return MPP.client.ppl[Object.keys(MPP.client.ppl)[Math.round(Math.random() * MPP.client.channel.count)]].name; }

function insult() { return MPP.chat.send( meow() + ' is a ' + randomWord() + ' ' + randomWord() + ' ' +randomWord() ) }

rpsr = ['paper','rock','scissors']; 
function rpsrresponse() { return rpsr[Math.floor(Math.random() * rpsr.length)]; };
function rps(lol) { if(lol == 'paper') { MPP.chat.send('[RPS]: You chose paper. The AI chose ' + rpsrresponse() + '') } else { if(lol == 'rock') { MPP.chat.send('[RPS]: You chose rock. The AI chose ' + rpsrresponse() + '') } else { if(lol == 'scissors') { MPP.chat.send('[RPS]: You chose scissors. The AI chose ' + rpsrresponse() + '') } else { MPP.chat.send( error + 'Incorrect use. Usage: ' + cmdChar + 'rockpaperscissors <Paper/Rock/Scissors> (' + cmdChar + 'rps)') } } } }

MPP.client.on("a", function (msg) { var cmd = msg.a.split(' ')[0].toLowerCase(); var input = msg.a.substring(cmd.length).trim(); if(Power == "on" == true) { if (cmd == cmdChar+"rps") { if (banned.includes(msg.p._id) || blNames.includes(msg.p.name)) { } else { if (input == "") { MPP.chat.send("[RPS] Welcome to Rock Paper Scissors! To start playing: " + cmdChar + "rockpaperscissors <Paper/Rock/Scissors>") }  else { rps(input) }}}}});

function resetBattery() { battery = 100; Power = 'on'; batterything = true; batterything1 = true; batterything2 = true; batterything3 = true; googleCommand = true; batteryenabled = true }

botname = 'EpicOS 2 [OLD]';
cmdChar = '/';

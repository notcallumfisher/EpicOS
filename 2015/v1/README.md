# EpicOS (v1)

## cleaned-2024.js

- The original version of EpicOS, created in 2015, preserved in all its tacked-together-by-a-nine-year-old glory - cleaned up slightly for publication in 2024.

## rewritten-2024.js

- A rewritten userscript version of EpicOS (v1), created in 2024, optimized for modern browsers.

After [installing EpicOS as a userscript](https://greasyfork.org/scripts/521353), you can send /help to chat on [Multiplayer Piano](https://multiplayerpiano.com) to see its command list.

### Features

#### Commands

##### *Public*

###### Commands everybody can use.

- /help - Displays the command list.
- /lol - Displays a 'lol' laughing message.
- /test - Displays a test message.
- /say - Echoes the user's text input.
- /encode - Encodes inputted text.
- /decode - Decodes input.
- /binary - Converts inputted text to binary.
- /myinfo - Displays a user's information (_ID, ID if applicable and colour HEX & name).
- /8ball - Asks the not-so-magic-8ball to answer your yes/no questions.
- /about - Displays information about the bot.

##### *Private*

###### Commands only the bot operator (you) can use.

- /welcome - Toggles welcome messages when users join the room.
- /clear - Clears the chat box for the bot operator.

#### Settings

The following variables can be set towards the top of the userscript:

- cmdChar - What a message should start with to be recognized as a command - You can change this to anything. The default is /
- welcomeUsers - Whether or not to welcome users that enter the room - Can be true or false. The default is false
- sendStartUpMsg - Whether or not to send a greeting message on start-up - Can be true or false. The default is false
- antiSpamTimeout - Time in milliseconds before the bot can repeat its last chat message - Can be any value in milliseconds. The default is 40000

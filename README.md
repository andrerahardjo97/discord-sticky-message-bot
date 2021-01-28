<div align="center">
  <br />
    <h1>Discord Sticky Message Bot</h1>
  <br />
  <img src="https://i.imgur.com/AmOmZKK.gif" alt="Bot preview" />
  <p>
    <a href="https://www.gnu.org/licenses/gpl-3.0.en.html"><img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="License" /></a>
  </p>
</div>

## About

This bot gonna send your stickied message after few message.
<br />
This bot is inspired by [StickyBot](https://top.gg/bot/628400349979344919).

## Support

I don't offer support about error in installation. I only offer support for bug and error when the code is running.
<br />
I will try to keep the code up to date when there's a major release in libraries that this bot use.

## Contributing

I only welcome pull requests that fix bug, typo, or broken english. <br />
If you want to add new feature to this bot, just fork this repository.

## Requirements

- [Node.js](https://nodejs.org) v14 or higher
- NPM (Included in Node.js installer by default) or [Yarn](https://yarnpkg.com)

**If you use NPM**, delete `yarn.lock` file.

## Getting Started

1. Clone or [download](https://github.com/LiuAndre/discord-sticky-message-bot/releases) this repository
2. Go to the folder where you clone or download this repository
3. Type `npm install` or `yarn install` depend on what you use
4. Rename `.env.example` to `.env` and fill that file. Below is the explanation.
```env
DISCORD_TOKEN=(fill your bot token here)
ALLOWED_ROLES_ID=(allowed roles id, just leave it blank if you don't want to use this)
MAX_MESSAGE_COUNT=(how many message before the bot send the message again. Minimum is 5 if you want to comply with Discord ToS)
OWNER=(your user id or someone user id (e.g. server owner))
PREFIX=(command prefix)
```
5. Type `node index.js` to start the bot

If you don't know how to get the bot token, check [this guide](https://anidiots.guide/getting-started/getting-started-long-version).
<br />
You want to host it? Check this [hosting guide](https://anidiots.guide/hosting).
<br />
If you use Heroku, **do not** commit the `.env` file and fill the `.env` like the guide above said.
<br />
After you deploy it on Heroku, if it's your first time, **don't forget** to turn on all the process type. I already include the `Procfile` file for Heroku in this repository.

## Usage

```
-stick <message that you want to stick>

-unstick
```

## Code Explanation

This is a [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents).
```javascript
const client = new Discord.Client({
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MESSAGES",
    ],
  },
});
```
I define the Gateway Intents because this bot only use message event. There's no use to listen to other event.
<br />
<br />

Remove the code below ([line 23-25](https://github.com/andrerahardjo97/discord-sticky-message-bot/blob/74eb73ff2d00943aad5fefd33015600370b8479f/index.js#L23-L25)) if you gonna use this bot on a bot channel.
The code below make the bot not execute the rest of the code if the sender of the message is bot.
```javascript
if (message.author.bot) {
  return;
}
```
<br />

The code below only run if the message does not have command prefix.
```javascript
// Check if the message have command prefix or not.
if (message.content.indexOf(process.env.PREFIX) !== 0) {
  // Check if user already stick a message or not.
  if (stickyMessageContent !== "") {
    // Check the channel id, is it same with the channel id where the message is stickied.
    if (message.channel.id === stickyMessageChannel) {
      // Increment message counter.
      messageCount++;
      // Check if it's already hit the maximum message count that is defined.
      if (messageCount === maxMessageCount) {
        // Delete last sticky message.
        await lastStickyMessage.delete();
        // Send new sticky message.
        lastStickyMessage = await message.channel.send(stickyMessageContent);
        // Reset the counter.
        messageCount = 0;
      }
    }
  }

  return;
}
```
<br />

Split the message by space if the message has command prefix.
```javascript
const args = message.content.slice(1).trim().split(/ +/g);
```
<br />

Get the first element of `args`, because it's the command name
```javascript
const command = args.shift().toLowerCase();
```

## Library That I Use

- [Discord.js](https://github.com/discordjs/discord.js)
- [dotenv](https://github.com/motdotla/dotenv)
- [ESLint](https://github.com/eslint/eslint) (dev dependency)

## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

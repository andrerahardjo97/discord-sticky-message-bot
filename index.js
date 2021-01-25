require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client({
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MESSAGES",
    ],
  },
});

const maxMessageCount = parseInt(process.env.MAX_MESSAGE_COUNT);
let lastStickyMessage = "";
let messageCount = 0;
let stickyMessageChannel = "";
let stickyMessageContent = "";

client.once("ready", async function () {
  console.info(`Bot ready! | ${client.user.username}`);
});

client.on("message", async function (message) {
  if (message.author.bot) {
    return;
  }

  if (message.content.indexOf(process.env.PREFIX) !== 0) {
    if (stickyMessageContent !== "") {
      if (message.channel.id === stickyMessageChannel) {
        messageCount++;
        if (messageCount === maxMessageCount) {
          await lastStickyMessage.delete();
          lastStickyMessage = await message.channel.send(stickyMessageContent);
          messageCount = 0;
        }
      }
    }

    return;
  }

  const args = message.content.slice(1).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "stick") {
    if (
      message.author.id === process.env.OWNER
      || message.member.roles.cache.has(process.env.ALLOWED_ROLES_ID)
    ) {
      try {
        stickyMessageChannel = message.channel.id;
        stickyMessageContent = args.slice(0).join(" ");
        lastStickyMessage = await message.channel.send(stickyMessageContent);
        await message.delete();
      } catch (error) {
        console.error(error);
      }
    }
  } else if (command === "unstick") {
    if (
      message.author.id === process.env.OWNER
      || message.member.roles.cache.has(process.env.ALLOWED_ROLES_ID)
    ) {
      lastStickyMessage = "";
      messageCount = 0;
      stickyMessageChannel = "";
      stickyMessageContent = "";
      message.delete();
    }
  }
});

client.login();

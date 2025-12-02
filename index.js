require('dotenv').config();

const { 
    Client, 
    GatewayIntentBits, 
    ActivityType, 
    Events,
    Collection
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { generateResponse } = require('./ai.js');

const GuildConfig = require('./models/GuildConfig');

async function loadGuildConfig(guildId) {
    const config = await GuildConfig.findOne({ guildId });
    return config;
}
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Bot logged as ${readyClient.user.tag}!!`);

    readyClient.user.setPresence({
        status: 'dnd',
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'An unknown error ocurred.', ephemeral: true });
    }
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot === true) return;

    const guildId = message.guild?.id;
    if (!guildId) return;

    const config = await GuildConfig.findOne({ guildId });
    if (!config || !config.channelId) return;

    if (message.channel.id !== config.channelId) return;

    if (message.channel.rateLimitPerUser !== 5) {
        message.channel.setRateLimitPerUser(5, 'The slowmode is required so the AI bot can answer properly.');
    }

    message.channel.sendTyping();
    const delay = Math.floor(Math.random() * 1000) + 4000;
    await new Promise(res => setTimeout(res, delay));

    const aiReply = await generateResponse(message.content, message.author.id, message.guild.id);
    
    message.reply(aiReply);
});


client.login(process.env.BOT_TOKEN);

//

const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected succesfully!");
    } catch (error) {
        console.error(error)
    }
}

connectDB();

const express = require("express");
const app = express();


app.get("/", (req, res) => {
  res.send("Bot active");
});

// Render usa una variable PORT automáticamente
app.listen(process.env.PORT || 3000, () => {
});